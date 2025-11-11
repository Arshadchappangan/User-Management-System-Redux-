import './App.css'
import "react-toastify/dist/ReactToastify.css";
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position='top-right' autoClose={2000} />
    </>
  )
}

export default App
