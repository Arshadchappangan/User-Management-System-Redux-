import { useReducer } from "react";
import InputField from "../Components/InputField";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const icon_paths = {
  name: "M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM4 20c0-4 4-6 8-6s8 2 8 6",
  email: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
  password: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
};

const types = {
  CHANGE_FIELD: "CHANGE_FIELD",
  VALIDATE_FIELD: "VALIDATE_FIELD",
  RESET_FORM: "RESET_FORM",
};


const initialState = {
  form: { name: "", email: "", password: "", confirmPassword: "" },
  errors: { name: "", email: "", password: "", confirmPassword: "" },
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.CHANGE_FIELD:
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };

    case types.VALIDATE_FIELD:
      const { field, value } = action;
      let message = "";

      if (field === "name") {
        if (!value || value.trim().length < 3)
          message = "Please enter full name (min 3 characters)";
      }

      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) message = "Email is required";
        else if (!emailRegex.test(value))
          message = "Please enter a valid email address";
      }

      if (field === "password") {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!value.trim()) message = "Password is required";
        else if (!passwordRegex.test(value))
          message =
            "Password must be at least 8 characters and include upper, lower and a number";
      }

      if (field === "confirmPassword") {
        if (!value) message = "Please confirm your password";
        else if (value !== state.form.password)
          message = "Passwords do not match";
      }

      return {
        ...state,
        errors: { ...state.errors, [field]: message },
      };

    case types.RESET_FORM:
      return initialState;

    default:
      return state;
  }
};

const SignUp = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { form, errors } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: types.CHANGE_FIELD, field: name, value });
    dispatch({ type: types.VALIDATE_FIELD, field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('signup')
    console.log(form)

    Object.entries(form).forEach(([key, value]) =>
      dispatch({ type: types.VALIDATE_FIELD, field: key, value })
    );

    const hasErrors = Object.values(state.errors).some((msg) => msg !== "");
    if (hasErrors || Object.values(form).some((val) => val === "")) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log(response.status);
      
      if (response.status == 201) {
        dispatch({ type: types.RESET_FORM });
        toast.success("User Registration Successful");
        setTimeout(() => navigate("/signin"),1000)
      }
    } catch (error) {
      console.error(error);
      toast.error(
        (error && error.response?.data?.message) || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated glowing background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white/10">
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

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
            <p className="text-gray-300 text-sm">User Management System</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              handleChange={handleChange}
              label="Name"
              type="text"
              name="name"
              placeholder="Enter your name"
              svg_path={icon_paths.name}
              err={errors.name}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

            <InputField
              handleChange={handleChange}
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              svg_path={icon_paths.email}
              err={errors.email}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <InputField
              handleChange={handleChange}
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              svg_path={icon_paths.password}
              err={errors.password}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <InputField
              handleChange={handleChange}
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              svg_path={icon_paths.password} 
              err={errors.confirmPassword}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-amber-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                className="text-amber-400 font-semibold hover:text-amber-300 cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Login here
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>Secure signup • Protected by encryption</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
