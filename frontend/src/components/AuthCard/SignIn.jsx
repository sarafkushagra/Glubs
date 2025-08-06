import React, { useState } from "react";
import axios from "axios";
import { HiMiniHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/userStore";
import { toast } from "react-toastify";

const SignInForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth, updateUser } = useAuth();
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

      setAuth({ user : data.user, token });
      toast.success("SignIn successful!");
      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      if (data.user.role === "student") {
        navigate("/events");
      }
       else if (data.user.role === "club-admin") {
        navigate("/clubadmin");
      }
      else if (data.user.role === "admin") {
        navigate("/admin/dash");
      }
      else {
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
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer text-2xl text-gray-600 mb-4"
      >
        <HiMiniHome />
      </div>

      <h2 className="text-2xl font-bold text-center text-[#3d348b] mb-6">
        Sign in to Glubs
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none"
          required
        />

        <p className="text-sm text-right text-blue-500 hover:underline cursor-pointer" onClick={() => {navigate("/forgot-password")}}>
          Forgot your password?
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3d348b] hover:bg-[#2d2d6b] text-white py-2 rounded"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        Don’t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:underline"
          onClick={onSwitch}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default SignInForm;
