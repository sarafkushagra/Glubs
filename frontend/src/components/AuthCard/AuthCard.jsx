import { useState } from "react";

import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

const AuthCard = () => {
   const [isSignIn, setIsSignIn] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-xl flex overflow-hidden transition-all duration-700">
                {/* Left side (Form) */}
                {isSignIn ? <div className="w-1/2 flex items-center justify-center bg-white"><SignInForm /></div> : (
                    <div className="w-1/2 bg-gradient-to-br from-[#3d348b] to-[#00509d] text-white flex flex-col items-center justify-center text-center p-8">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <p className="mb-6">To keep connected with us please login with your personal info</p>
                        <button
                            onClick={() => setIsSignIn(true)}
                            className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-teal-600 transition"
                        >
                            SIGN IN
                        </button>
                    </div>
                )}


                {/* Right side (Panel) */}
                {isSignIn ? (
                    <div className="w-1/2 bg-gradient-to-br from-[#00509d] to-[#3d348b] text-white flex flex-col items-center justify-center text-center p-8">
                        <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
                        <p className="mb-6">Enter your personal details and start journey with us</p>
                        <button
                            onClick={() => setIsSignIn(false)}
                            className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-teal-600 transition"
                        >
                            SIGN UP
                        </button>
                    </div>
                ) : (<div className="w-1/2 flex items-center justify-center bg-white"><SignUpForm /></div>)}

            </div>
        </div>
    );
};

export default AuthCard;
