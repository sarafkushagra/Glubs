// pages/EmailVerificationPage.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

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
      navigate("/");
    } catch (err) {
      toast.error("Verification failed: " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/resend-otp",
        {},
        { withCredentials: true }
      );
      toast.info("OTP sent again to your email!");
    } catch (err) {
      toast.error("Resend failed.");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-black px-4">
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
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
              className="w-12 h-14 text-center border-2 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
        </div>

        <button
          onClick={verifyHandler}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={resendHandler}
          className="w-full mt-2 text-sm text-blue-500 hover:underline"
        >
          Resend OTP
        </button>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
