import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminRouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("glubsUser") || "null");
    
    if (userData?.role === "admin") {
      const allowedAdminPaths = [
        "/admin",
        "/allusers",
        "/users/details",
        "/auth",
        "/verify",
        "/forgot-password",
        "/verify-otp",
        "/reset-success",
        "/unauthorized"
      ];

      const isAllowed = allowedAdminPaths.some(path => 
        location.pathname === path || location.pathname.startsWith(path + "/")
      );

      if (!isAllowed) {
        navigate("/admin/dash", { replace: true });
      }
    } else if (userData?.role === "club-admin") {
      const allowedClubAdminPaths = [
        "/clubadmin",
        "/qr-scan",
        "/events/add",
        "/events/edit",
        "/clubs/edit",
        "/clubs/add",
        "/clubs",
        "/auth",
        "/verify",
        "/forgot-password",
        "/verify-otp",
        "/reset-success",
        "/unauthorized",
        "/notifications"
      ];

      const isAllowed = allowedClubAdminPaths.some(path => 
        location.pathname === path || location.pathname.startsWith(path + "/")
      );

      if (!isAllowed) {
        navigate("/clubadmin", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return children;
};

export default AdminRouteGuard;
