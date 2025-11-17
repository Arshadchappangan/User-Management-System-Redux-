import { User, LogOut, Home } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/userSlice';
import { useState } from 'react';
import Swal from 'sweetalert2'
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { name, id, profileImage } = useSelector(state => state.user);
    console.log(profileImage)

    const handleProfile = () => {
        navigate(`/profile/${id}`);
    }

    //local component
    const Avatar = ({ src, size = 40, className = '' }) => {
        const [errored, setErrored] = useState(false);
        const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 40;

        if (!src || errored) {
            return (
                <div style={{ width: numericSize, height: numericSize }}
                    className={`bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center ${className}`}
                >
                    <User
                        style={{ width: numericSize * 0.5, height: numericSize * 0.5 }}
                        className="text-white"
                    />
                </div>
            );
        }

        const resolved = src.startsWith('http') ? src : `${backendUrl}/uploads/${src}`;

        return (
            <img src={resolved} alt={name || 'Profile'}
                className={`${className} object-cover`}
                style={{
                    width: numericSize,
                    height: numericSize,
                    borderRadius: '9999px',
                }}
                onError={() => setErrored(true)}
            />
        );
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your session!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                toast.info("Logged out successfully!");
                navigate("/signin");
            }
        });
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Home</span>
                        </div>

                        {/* Profile */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleProfile}
                                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition duration-200"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                                    <Avatar src={profileImage} size={40} />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-200">
                                    {name || 'User'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center px-4 py-12 sm:py-20">
                <div className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 sm:p-12 max-w-2xl w-full border border-white/10">
                    {/* Welcome Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full mb-6 overflow-hidden">
                            {profileImage ? (
                                <Avatar src={profileImage} size={80} />
                            ) : (
                                <User className="w-10 h-10 text-amber-500" />
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                            Welcome Back, {name || 'User'}!
                        </h1>
                        <p className="text-lg text-gray-300">
                            We’re excited to see you today. Explore your dashboard and manage your account.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleProfile}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-500 hover:to-yellow-600 transition duration-300 transform hover:scale-105"
                        >
                            <User className="w-5 h-5" />
                            <span>View My Profile</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/10 text-red-400 font-semibold rounded-xl border border-red-400 shadow-md hover:bg-red-400/10 transition duration-300"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-400">
                            Need help? Visit our{' '}
                            <span className="text-amber-400 font-medium cursor-pointer hover:underline">
                                support center
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
