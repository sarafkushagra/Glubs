import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const RoleSelectionDialog = ({ isOpen, onClose }) => {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return toast.error("Please select a role");

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/users/request-club-admin",
        { requestedRole: selected },
        { withCredentials: true }
      );
      toast.success("Role request submitted successfully");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to submit role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-3 text-center text-gray-900 dark:text-white">
              Are you joining as a Student or Club-Admin?
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              This helps us set the right permissions for your account. Club-admins will require approval.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setSelected("student")}
                className={`w-full py-3 px-4 rounded-lg border text-left transition-all ${
                  selected === "student"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
              >
                <span className="font-medium">I'm a Student</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access events, participate, and explore campus activities.
                </p>
              </button>

              <button
                onClick={() => setSelected("club-admin")}
                className={`w-full py-3 px-4 rounded-lg border text-left transition-all ${
                  selected === "club-admin"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
              >
                <span className="font-medium">I'm a Club-Admin</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request permissions to manage club events and announcements.
                </p>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-5 py-2 rounded-lg text-sm"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelectionDialog;
