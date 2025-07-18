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

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error on typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setServerError(""); // Clear global error
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.passwordConfirm) newErrors.passwordConfirm = "Please confirm your password";
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = "Passwords do not match";

    return newErrors;
  };

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
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/signup",
        formData,
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        navigate("/verify");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong.";
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Sign Up</h2>

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
            className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
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
            className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
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
            className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          {errors.passwordConfirm && (
            <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
