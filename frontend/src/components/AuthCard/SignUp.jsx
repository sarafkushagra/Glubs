import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/userStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Password strength evaluation function
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  // Return numeric score for progress bar
  return score;
}

const SignUpForm = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Enforce max length for password fields
    if ((name === "password" || name === "passwordConfirm") && value.length > 12) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length > 12) newErrors.password = "Password must be at most 12 characters";
    if (!formData.passwordConfirm) newErrors.passwordConfirm = "Please confirm your password";
    if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match";
    return newErrors;
  };

  const passwordScore = getPasswordStrength(formData.password);

  const getStrengthLabel = (score) => {
    if (score <= 2) return { label: "Weak", color: "text-red-500", barColor: "bg-red-500" };
    if (score <= 4) return { label: "Good", color: "text-yellow-500", barColor: "bg-yellow-500" };
    return { label: "Strong", color: "text-green-600", barColor: "bg-green-500" };
  };

  const strengthInfo = getStrengthLabel(passwordScore);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/signup`, formData, {
        withCredentials: true,
      });

      const { data, token } = response.data;

      setAuth({ user: data.user, token });
      toast.success("Signup successful! An OTP is send to your mail. Please verify your email.");
      if (response.data.status === "success") {
        navigate("/verify");
      }
    } catch (error) {
      if (error.response === "Please verify your email before logging in." && error.response.status === 401) {
        navigate("/verify");
        return;
      }
      const errMsg = error?.response?.data?.message || "Something went wrong.";
      toast.error(errMsg);
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-black mb-8">
        Create Account
      </h2>

      {serverError && (
        <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-5">
        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">
            Username
          </label>
          <div className="relative group">
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${errors.username ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300`}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {errors.username && (
            <p className="text-sm text-red-500 ml-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative group">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300`}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">
            Password
          </label>
          <div className="relative group">
            <input
              name="password"
              type="password"
              placeholder="Create a password (max 12 chars)"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300`}
              maxLength={12}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${formData.password.length > 0 ? 'opacity-100 translate-y-0 mt-2' : 'opacity-0 -translate-y-2 h-0 overflow-hidden'}`}
          >
            {formData.password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthInfo.barColor} transition-all duration-500`}
                    style={{ width: `${(passwordScore / 6) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold ${strengthInfo.color}`}>{strengthInfo.label}</span>
                  <span className="text-gray-400">{formData.password.length}/12</span>
                </div>
              </div>
            )}
            {formData.password.length > 0 && strengthInfo.label !== "Strong" && (
              <p className="text-xs text-gray-500 mt-1">
                Tip: Mix case, numbers & symbols
              </p>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 ml-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative group">
            <input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm your password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 ${errors.passwordConfirm ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300`}
              maxLength={12}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-black/0 group-hover:from-blue-500/5 group-hover:to-black/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {errors.passwordConfirm && (
            <p className="text-sm text-red-500 ml-1">{errors.passwordConfirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-black text-white rounded-xl hover:from-blue-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-lg hover:shadow-xl mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 md:hidden">
        Already have an account?{' '}
        <span
          className="text-blue-600 cursor-pointer font-bold hover:underline"
          onClick={onSwitch}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUpForm;

