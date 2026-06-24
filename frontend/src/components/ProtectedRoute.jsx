import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("glubsToken") || getCookie("glubsToken");
  const userData = JSON.parse(localStorage.getItem("glubsUser") || "null");

  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (!userData && !token) {
      setRedirectPath("/");
      return;
    }

    if (!token) {
      setRedirectPath("/auth");
      return;
    }

    if (!userData?.isVerified) {
      localStorage.setItem("redirectAfterVerify", location.pathname);
      setRedirectPath("/verify");
      return;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (allowedRoles && !roles.includes(userData?.role)) {
      toast.error("You are not authorized to access this page");
      setRedirectPath("/unauthorized");
      return;
    }

    setRedirectPath(null);
    localStorage.setItem("redirectAfterVerify", location.pathname);
  }, [userData, token, allowedRoles, location.pathname]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
