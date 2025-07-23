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
        "http://localhost:3000/users/login",
        formData,
        { withCredentials: true }
      );
      // console.log(res.data)
      const { data, token } = res.data;

      setAuth({ user : data.user, token });
      toast.success("SignIn successful!");
      const redirectPath =
        localStorage.getItem("redirectAfterVerify") || "/events";
      localStorage.removeItem("redirectAfterVerify");
      // console.log(redirectPath)
      if (data.user.role === "student") {
        navigate("/profile");
      } else {
        navigate("/clubadmin/dash");
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









// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/userStore";
// import { toast } from "react-toastify";

// const SignInForm = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const { setAuth } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/users/signin",
//         formData,
//         { withCredentials: true }
//       );

//       const { user, token } = res.data.data;
//       setAuth({ user, token });

//       toast.success("Login successful");
//       navigate("/dashboard"); // or wherever you want to go
//     } catch (err) {
//       const message =
//         err.response?.data?.message || "Invalid credentials. Try again.";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
//         Sign In
//       </h2>

//       <form onSubmit={submitHandler} className="space-y-4">
//         <div>
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//           />
//         </div>

//         <div>
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
//         >
//           {loading ? "Logging in..." : "Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignInForm;
