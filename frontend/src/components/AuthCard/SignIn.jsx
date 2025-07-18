import { useState } from "react";
import { HiMiniHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInForm = ({ onSwitch }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:3000/users/login",
        formData,
        { withCredentials: true }
      );
      console.log(formData);

      const actualUserData = response.data;

      
      if (actualUserData.status === "success") {
        localStorage.setItem("token", actualUserData.token);
        localStorage.setItem("username", actualUserData.data.user.username);
        navigate("/");
      }



    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer text-2xl text-gray-600 dark:text-white mb-4"
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

        <p className="text-sm text-right text-blue-500 hover:underline cursor-pointer">
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
