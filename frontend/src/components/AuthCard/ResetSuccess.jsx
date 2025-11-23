import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

/*
  Component: ResetSuccess
  Purpose:
    - Simple confirmation screen shown after a successful password reset.
    - Informs the user the reset succeeded and provides a CTA to go
      back to the login page.

  Behavior summary:
    - Uses `useNavigate` from react-router to redirect the user when they
      click the button.
    - Purely presentational; no props or remote calls.
*/

const ResetSuccess = () => {
  // Router navigation helper used for the 'Go to Login' button.
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="text-center space-y-4">
        {/* Success icon - purely decorative */}
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />

        {/* Title and supporting copy */}
        <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful</h2>
        <p className="text-gray-700">You can now log in with your new password.</p>

        {/* Primary action: navigate back to login page. Kept simple to avoid
            unexpected side-effects; any analytics or tracking should be
            handled where the component is used. */}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;
