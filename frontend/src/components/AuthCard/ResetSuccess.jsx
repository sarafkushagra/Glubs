import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ResetSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful</h2>
        <p className="text-gray-700">You can now log in with your new password.</p>
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
