// pages/EmailVerificationPage.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/userStore";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyHandler = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) return toast.error("Please enter 4-digit OTP");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/users/verify",
        { otp: fullOtp },
        { withCredentials: true }
      );
      toast.success("Verified successfully!");
      updateUser({isVerified: true});
      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      console.log(redirectPath)
      navigate(redirectPath);
    } catch (err) {
      toast.error(
        "Verification failed: " + (err.response?.data?.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/resend-otp",
        { email: user.email },
        { withCredentials: true }
      );
      toast.info("OTP sent again to your email!");
    } catch (err) {
      toast.error("This accound is already verified");
    }
  };

return (
  <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4">
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 tracking-tight">
        Verify your Email
      </h2>

      <div className="flex justify-center gap-4 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-14 text-center text-xl border-2 border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        ))}
      </div>

      <button
        onClick={verifyHandler}
        disabled={loading}
        className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg transition duration-200"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        onClick={resendHandler}
        className="w-full mt-3 text-sm text-sky-600 hover:text-sky-700 font-medium transition duration-150"
      >
        Resend OTP
      </button>
    </motion.div>
  </div>
);
}


export default EmailVerificationPage;
