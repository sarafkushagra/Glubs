import { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";

/*
  Component: AuthCard
  Purpose:
    - Top-level authentication card used on the Auth page.
    - Controls whether the Sign In or Sign Up form is shown and
      provides a left-side branding panel used on larger screens.

  Key parts:
    - `isSignIn` state: boolean deciding which form to show.
    - Left branding column: visible on md+ screens; acts as a
      switch and provides contextual copy and CTA button.
    - Right form area: animates between `SignInForm` and `SignUpForm`
      using `framer-motion`'s `AnimatePresence` for smooth transitions.

  Props: none (local UI state only). Child forms receive `onSwitch`
    callbacks to toggle between modes.

  Notes for maintainers:
    - Avoid putting business logic in this component; keep it UI-only.
    - `SignInForm` and `SignUpForm` should handle submission and
      navigation (e.g., redirect after success) via their own props.
*/

const AuthCard = () => {
  // Local boolean state: true -> show Sign In; false -> show Sign Up.
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a093f] via-[#2d297a] to-[#e6e6fa] px-4">
      <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-700">
        {/* Left Side Branding: hidden on small screens, visible on md+ */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 text-white bg-gradient-to-br from-[#3d348b] to-[#00509d]">
          {/* Heading text changes based on current mode */}
          <h2 className="text-4xl font-bold mb-4">
            {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
          </h2>

          {/* Supporting paragraph, mode-specific copy */}
          <p className="mb-6 text-lg text-center">
            {isSignIn
              ? "To keep connected with us please login with your personal info"
              : "Enter your personal details and start your journey with us"}
          </p>

          {/* Toggle button: flips `isSignIn` state when clicked. Child forms
              also receive `onSwitch` to allow toggling from inside the forms. */}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-[#3d348b] transition duration-300"
          >
            {isSignIn ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>

        {/* Right Side Form: contains the sign in / sign up forms */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          {/* AnimatePresence with `mode="wait"` ensures exit animation
              completes before the new component enters. */}
          <AnimatePresence mode="wait">
            <motion.div
              // Key toggles between 'signin' and 'signup' to trigger animation
              key={isSignIn ? "signin" : "signup"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Render the appropriate form and pass a small `onSwitch`
                  callback so child can request toggling the view. */}
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
