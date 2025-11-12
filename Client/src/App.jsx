import './App.css'
import "react-toastify/dist/ReactToastify.css";
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Profile from './Pages/profile';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import { useSelector } from 'react-redux';


function App() {

  const { auth, role } = useSelector(state => state.user);

  const Authenticated = ({ element, allowedRoles }) => {

    if (!auth) return <Navigate to={'/signin'} />

    if (allowedRoles && !allowedRoles.includes(role)) {
      if (role === 'user') return <Navigate to={'/'} />
      if (role === 'admin') return <Navigate to={'/admin/dashboard'} />
    }

    return element;
  }

  const UnAuthendicate = ({ element }) => {
    if (auth && role === 'user') return <Navigate to={'/'} />
    if (auth && role === 'admin') return <Navigate to={'/admin/dashboard'} />
    return element;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<UnAuthendicate element={<SignUp />} />} />
          <Route path='/signin' element={<UnAuthendicate element={<SignIn />} />} />
          <Route path='/' element={<Authenticated element={<Home />} allowedRoles={['user']} />} />
          <Route path='/admin/dashboard' element={<Authenticated element={<Dashboard />} allowedRoles={['admin']} />} />
          <Route path='/profile/:id' element={<Authenticated element={<Profile />} allowedRoles={['user']} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position='top-right' autoClose={2000} />
    </>
  )
}

export default App
