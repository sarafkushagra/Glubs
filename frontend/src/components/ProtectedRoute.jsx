import React from "react";
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

  // Clear previous redirection
  if (localStorage.getItem("redirectAfterVerify")) {
    localStorage.removeItem("redirectAfterVerify");
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  // check for is user previously signup ot not 
  if (!userData && !token) {
    return <Navigate to="/" replace />;
  }

  // check if there is no token means user comes firsst time here
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  localStorage.setItem("redirectAfterVerify", location.pathname);

  // check is email verification is done for current user
  if (!userData?.isVerified) {
    localStorage.setItem("redirectAfterVerify", location.pathname);
    return <Navigate to="/verify" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
