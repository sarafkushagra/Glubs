import { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-indigo-200 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 transition-all duration-700 min-h-[650px]">
        {/* Left Side Branding */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 text-white relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center z-10"
          >
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
            </h2>
            <p className="mb-8 text-lg text-gray-200 font-light px-4">
              {isSignIn
                ? "Register with your personal details to use all of site features"
                : "Enter your personal details to use all of site features"}
            </p>
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="px-8 py-3 bg-white/10 border-2 border-white/50 text-white rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-semibold backdrop-blur-sm transform hover:scale-105"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </motion.div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-white/50 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
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
