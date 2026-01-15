import React, { useState } from "react";
import axios from "axios";
import { HiMiniHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/userStore";
import { toast } from "react-toastify";

const SignInForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        formData,
        { withCredentials: true }
      );
      const { data, token } = res.data;

      setAuth({ user: data.user, token });
      toast.success("SignIn successful!");
      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      if (data.user.role === "student") {
        navigate("/events");
      } else if (data.user.role === "club-admin") {
        navigate("/clubadmin");
      } else if (data.user.role === "admin") {
        navigate("/admin/dash");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid credentials. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-black">
          Sign In
        </h2>
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          title="Go Home"
        >
          <HiMiniHome size={24} />
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300"
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="flex justify-end">
          <p
            className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl hover:from-blue-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 md:hidden">
        Don’t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer font-bold hover:underline"
          onClick={onSwitch}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default SignInForm;
