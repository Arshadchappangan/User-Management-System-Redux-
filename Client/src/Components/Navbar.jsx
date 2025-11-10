import { User, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="relative z-10 bg-gray-200 bg-opacity-90 backdrop-blur-sm px-6 py-3 flex justify-between items-center">
            <div className="text-gray-700 font-semibold text-lg">Material Dashboard 2</div>
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                    <LogIn size={18} />
                    <span>Dashboard</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                    <User size={18} />
                    <span>Profile</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                    <LogIn size={18} />
                    <span>Sign In</span>
                </button>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                    FREE DOWNLOAD
                </button>
            </div>
        </nav>
    )
}

export default Navbar
