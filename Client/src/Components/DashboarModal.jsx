import React from 'react'

const DashboarModal = ({editingUser}) => {
  return (
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
                  className="bg-white/10 border border-white/20 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="bg-white/10 border border-white/20 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="bg-white/10 border border-white/20 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                  />
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
  )
}

export default DashboarModal
