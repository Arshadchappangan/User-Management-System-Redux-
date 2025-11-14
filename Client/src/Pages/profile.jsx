import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setProfileImage } from "../Redux/userSlice";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const profile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [image, setImage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const { name, id, email, token } = useSelector(state => state.user);
    const [file, setFile] = useState(null);

    useEffect(() => {

        const getUser = async () => {
            try {
                const response = await axios.get(`${backendUrl}/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setImage(response.data.user.profileImage);
            } catch (error) {
                console.error(error);
                if (error.response.status === 403) {
                    dispatch(logout());
                    navigate('/signin');
                }
                toast.error(error.response.data.message || "Error while upload image");
            }
        }
        getUser();
    }, [id, refresh])

    const handleUpload = async () => {
        if (!file) {
            toast.error('Image is not selected');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);
            let response = await axios.post(`${backendUrl}/profile/upload/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Profile Image Updated');
            dispatch(setProfileImage(response.data.profileImage))
            setFile(null);
            setRefresh(!refresh);
        } catch (error) {
            if (error.response?.status === 403) {
                dispatch(logout());
                navigate("/signin");
            }
            toast.error(error.response.data.message || "Error while uploading");
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 p-6 overflow-hidden">

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
            </div>

            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-amber-500 hover:to-yellow-600 transition duration-300"
            >
                Back to Home
            </button>

            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/10 space-y-6 z-10">
                <h2 className="text-3xl font-bold text-center text-white">
                    Profile
                </h2>

                <div className="flex justify-center">
                    {image ? (
                        <img
                            src={`${backendUrl}/uploads/${image}`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-gray-300 shadow-md border border-white/10">
                            No Image
                        </div>
                    )}
                </div>


                <div className="text-center">
                    <p className="text-3xl font-semibold text-white">
                        <span className="text-amber-300">{name || "User"}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                        {email || "sample@email.com"}
                    </p>
                </div>


                <div className="flex flex-col items-center space-y-3">
                    <label
                        htmlFor="file-upload"
                        className="w-full px-4 py-2 border border-white/10 rounded-md bg-white/10 text-gray-200 hover:bg-white/20 cursor-pointer text-center transition"
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />
                        {file ? file.name :
                            image ? 'Change Image' : "Choose Image"}
                    </label>

                    {
                        file && <div className="w-full flex justify-center gap-4">
                            <button
                                onClick={() => setFile(null)}
                                className="w-2xs px-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold py-2 rounded-md shadow-lg hover:from-red-500 hover:to-red-600 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                className="w-2xs px-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold py-2 rounded-md shadow-lg hover:from-amber-500 hover:to-yellow-600 transition duration-300"
                            >
                                Upload Image
                            </button>
                        </div>

                    }

                </div>
            </div>
        </div>
    );
}

export default profile
