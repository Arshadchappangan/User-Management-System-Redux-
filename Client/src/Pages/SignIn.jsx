import axios from "axios";
import InputField from "../Components/InputField";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";


const icon_paths = {
    email: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207',
    password: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
}

const SignIn = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3555/signin', form)
            if(response.status === 200) {
                toast.success('Sign In Successfull');
                dispatch(login(response.data));
                console.log(response.data);
                response.data.role === 'user' ? navigate('/') : navigate('/dashboard')
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || 'Something went wrong while Sign In')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/10">
                    {/* Logo/Icon area */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                        <p className="text-gray-300 text-sm">User Management System</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <InputField
                            label='Email'
                            type='email'
                            name='email'
                            placeholder='you@example.com'
                            svg_path={icon_paths.email}
                            handleChange={handleChange}
                        />

                        <InputField
                            label='Password'
                            type='password'
                            name='password'
                            placeholder='Enter your password'
                            svg_path={icon_paths.password}
                            handleChange={handleChange}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-amber-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Sign up link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            Don't have an account?{" "}
                            <a
                                href="#"
                                className="text-amber-400 font-semibold hover:text-amber-300 transition duration-200"
                            >
                                Create account
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className="mt-8 text-center text-gray-400 text-xs">
                    <p>Secure login • Protected by encryption</p>
                </div>
            </div>
        </div>

    );
};

export default SignIn;