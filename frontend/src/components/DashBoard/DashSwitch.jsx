// App.jsx
import React, { useState } from "react";
import Dashboard from "./UserAdminDashboard";

export default function App() {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen bg-sky-100 p-4">
      {/* Switch Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setRole("user")}
          className={`px-6 py-2 rounded ${role === "user" ? "bg-sky-600 text-white" : "bg-gray-300"}`}
        >
          User View
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`px-6 py-2 rounded ${role === "admin" ? "bg-sky-600 text-white" : "bg-gray-300"}`}
        >
          Admin View
        </button>
      </div>

      {/* Dashboard */}
      <Dashboard role={role} />
    </div>
  );
}
