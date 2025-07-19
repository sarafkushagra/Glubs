import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const VerifyOTPAndReset = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const { otp, password, passwordConfirm } = formData;

    if (password !== passwordConfirm) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/users/reset-password", {
        email,
        otp,
        password,
        passwordConfirm,
      });

      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      console.log(redirectPath)
      navigate(redirectPath);
    } catch (err) {
      alert("Invalid OTP or server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Enter OTP & New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            name="otp"
            maxLength={6}
            required
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-xl"
            value={formData.otp}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            required
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-xl"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="passwordConfirm"
            required
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border rounded-xl"
            value={formData.passwordConfirm}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPAndReset;
