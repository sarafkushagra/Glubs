import { useState } from "react";
import logo from "../assets/image.png";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      // Adjust endpoint as per your backend
      await axios.post("http://localhost:5000/api/v1/users/forgotPassword", { email });
      setMessage("If this email is registered, a password reset link has been sent.");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-center text-[#3d348b] dark:text-white mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#3d348b] dark:bg-gray-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3d348b] hover:bg-[#2d2d6b] text-white py-2 rounded transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 