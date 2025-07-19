// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const SignUpForm = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     passwordConfirm: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/v1/users/signup",
//         formData,
//         { withCredentials: true }
//       );
//       const actualUserData = response.data;

//       if(actualUserData.status === "success"){
//         navigate("/verify");
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">LOGO</h2>
//         <form onSubmit={submitHandler} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
//             <input
//               name="username"
//               type="text"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
//             <input
//               name="password"
//               type="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
//             <input
//               name="passwordConfirm"
//               type="password"
//               placeholder="Confirm Password"
//               value={formData.passwordConfirm}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
//           >
//             {loading ? "Loading..." : "Submit"}
//           </button>
//         </form>
//         <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
//           Already have an account? <a href="/auth/login" className="underline">Login</a>
//         </div>
//         <div className="text-center mt-2">
//           <span className="inline-block text-lg">🔄</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpForm;




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
  if (score <= 2) return { label: "Weak", color: "text-red-500" };
  if (score <= 4) return { label: "Good", color: "text-yellow-500" };
  return { label: "Strong", color: "text-green-600" };
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

  const passwordStrength = getPasswordStrength(formData.password);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    console.log(formData);

    try {
      const response = await axios.post("http://localhost:3000/users/signup", formData, {
        withCredentials: true,
      });

      console.log(response.data)
      const { data, token } = response.data;

      setAuth({ user : data.user, token });
      toast.success("Signup successful! An OTP is send to your mail. Please verify your email.");
      if (response.data.status === "success") {
        navigate("/verify");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong.";
      toast.error(errMsg);
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">Sign Up</h2>
      {serverError && (
        <div className="text-red-500 text-sm mb-4 text-center">{serverError}</div>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Username */}
        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-black"
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-black"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password (max 12 chars)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-black"
            maxLength={12}
          />
          <div
            className={`transition-all duration-300 ease-in-out ${formData.password.length > 0 ? 'opacity-100 translate-y-0 mt-1' : 'opacity-0 -translate-y-2 h-0 overflow-hidden'}`}
          >
            {formData.password.length > 0 && (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${passwordStrength.color}`}>{passwordStrength.label} password</span>
                <span className="text-xs text-gray-400">({formData.password.length}/12)</span>
              </div>
            )}
            {formData.password.length > 0 && passwordStrength.label !== "Strong" && (
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use at least 8 characters, uppercase, lowercase, numbers, and special characters for a strong password.
              </p>
            )}
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-black"
            maxLength={12}
          />
          {errors.passwordConfirm && (
            <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#3d348b] text-white rounded hover:bg-[#2d2d6b]"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:underline"
          onClick={onSwitch}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUpForm;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/userStore";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const SignUpForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");

//   const navigate = useNavigate();
//   const { setAuth } = useAuth();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     passwordConfirm: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setServerError("");
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.username) newErrors.username = "Username is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     if (!formData.password) newErrors.password = "Password is required";
//     if (!formData.passwordConfirm) newErrors.passwordConfirm = "Please confirm your password";
//     if (formData.password !== formData.passwordConfirm)
//       newErrors.passwordConfirm = "Passwords do not match";
//     return newErrors;
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3000/users/signup", formData, {
//         withCredentials: true,
//       });

//       console.log(response.data)
//       const { user, token } = response.data;

//       setAuth({ user, token });
//       toast.success("Signup successful! An OTP is send to your mail. Please verify your email.");
//       if (response.data.status === "success") {
//         navigate("/verify");
//       }
//     } catch (error) {
//       const errMsg = error?.response?.data?.message || "Something went wrong.";
//       toast.error(errMsg);
//       setServerError(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Sign Up</h2>

//       {serverError && <div className="text-red-500 text-sm mb-4 text-center">{serverError}</div>}

//       <form onSubmit={submitHandler} className="space-y-4">
//         <div>
//           <input
//             name="username"
//             type="text"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//           />
//           {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
//         </div>

//         <div>
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//           />
//           {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
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
//           {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
//         </div>

//         <div>
//           <input
//             name="passwordConfirm"
//             type="password"
//             placeholder="Confirm Password"
//             value={formData.passwordConfirm}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
//           />
//           {errors.passwordConfirm && (
//             <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
//         >
//           {loading ? "Loading..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;


