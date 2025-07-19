import { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a093f] via-[#2d297a] to-[#e6e6fa] px-4">
      <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-700">
        {/* Left Side Branding */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 text-white bg-gradient-to-br from-[#3d348b] to-[#00509d]">
          <h2 className="text-4xl font-bold mb-4">
            {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
          </h2>
          <p className="mb-6 text-lg text-center">
            {isSignIn
              ? "Enter your personal details and start your journey with us"
              : "To keep connected with us please login with your personal info"}
          </p>
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-[#3d348b] transition duration-300"
          >
            {isSignIn ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>
        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin" : "signup"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {isSignIn ? (
                <SignInForm onSwitch={() => setIsSignIn(false)} />
              ) : (
                <SignUpForm onSwitch={() => setIsSignIn(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
