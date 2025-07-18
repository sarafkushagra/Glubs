import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold text-white mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          403 🚫
        </motion.h1>

        <p className="text-lg md:text-xl text-gray-300 mb-6">
          You don’t have permission to access this page.
        </p>

        <p className="text-sm text-gray-400 mb-8">
          This route is restricted to a different user role.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-semibold py-2 px-5 rounded-xl shadow-lg"
        >
          Go back home
        </button>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;