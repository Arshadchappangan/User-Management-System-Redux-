import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../Redux/userSlice";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [page, setPage] = useState(1);
  const [pages, setTotalPages] = useState(1);
  const [id, setEditId] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {

    fetchUser();
  }, [page]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/dashboard?page=${page}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response?.data?.users);
      setTotalPages(response?.data?.pages);
      setTotalUsers(response?.data?.total);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching users");
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditId(user._id);
    setFormData({ name: user.name, email: user.email, password: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingUser) {
      Swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update this user's details?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`${backendUrl}/admin/edit-user/${id}`,
              { name: formData.name, email: formData.email },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("User details have been updated");
            setShowModal(false);
            fetchUser();
          } catch (error) {
            let errorMessage = error.response?.data?.message;
            if (errorMessage.toLowerCase().includes("email")) setErrors({ ...errors, email: errorMessage });
            else if (errorMessage.toLowerCase().includes("user")) setErrors({ ...errors, email: errorMessage });
            else if (errorMessage.toLowerCase().includes("name")) setErrors({ ...errors, name: errorMessage });
            else toast.error("Error updating user.");
          }
        }
      });
    } else {
      try {
        await axios.post(`${backendUrl}/admin/create-user`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User added successfully.");
        setShowModal(false);
        fetchUser();
      } catch (error) {
        let errorMessage = error.response?.data?.message;
        if (errorMessage.toLowerCase().includes('email')) setErrors({ ...errors, email: errorMessage });
        else if (errorMessage.toLowerCase().includes('user')) setErrors({ ...errors, email: errorMessage });
        else if (errorMessage.toLowerCase().includes('name')) setErrors({ ...errors, name: errorMessage });
        else if (errorMessage.toLowerCase().includes('password')) setErrors({ ...errors, password: errorMessage });
        else toast.error("Error creating user.");
      }
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${backendUrl}/admin/delete-user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("User deleted successfully!");
          fetchUser();

        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to delete user.",
            "error"
          );
        }
      } else {
        toast.info("Deletion cancelled.");
      }
    });
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

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-300">Manage and monitor user accounts</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-amber-500 hover:to-yellow-600 transition-all font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-amber-500/10 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{totalUsers}</p>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md`}
              >
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-indigo-500/10 transition md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-md">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search users by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all shadow-md font-medium w-full sm:w-auto justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-md mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-200">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((user, i) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="bg-amber-400/10 text-amber-400 px-4 py-2 rounded-lg border border-amber-400 hover:bg-amber-400/20 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-400/10 text-red-400 px-4 py-2 rounded-lg border border-red-400 hover:bg-red-400/20 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-400 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl px-6 py-4 text-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {page > 1 && <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 disabled:opacity-40"
              >
                Page {page - 1}
              </button>}
            </div>
            <span>
              Page <strong>{page}</strong> of <strong>{pages}</strong>
            </span>
            <div>
              {page < pages && <button
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 disabled:opacity-40"
              >
                Page {page + 1}
              </button>}
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-5 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <p className="text-yellow-100 text-sm">
                {editingUser
                  ? "Update user details below"
                  : "Enter user details to create an account"}
              </p>
            </div>

            <div className="p-6 space-y-5 text-gray-200">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} p-3 w-full rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'focus: ring-red-500' : 'focus: ring-amber-400'}`}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => {
                    setErrors({ ...errors, name: '' })
                    setFormData({ ...formData, name: e.target.value })
                  }
                  }
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} p-3 w-full rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'focus: ring-red-500' : 'focus: ring-amber-400'}`}
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => {
                    setErrors({ ...errors, email: '' })
                    setFormData({ ...formData, email: e.target.value })
                  }
                  }
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} p-3 w-full rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'focus: ring-red-500' : 'focus: ring-amber-400'}`}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => {
                      setErrors({ ...errors, password: '' })
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    }
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/20 rounded-lg py-3 hover:bg-white/10 transition text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-yellow-600 shadow-md"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
