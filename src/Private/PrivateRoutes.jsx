import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../features/auth/authSlice";

const PrivateRoute = ({ children }) => {
  // const { auth } = useContext(AuthContext);
  const token = useSelector(selectAccessToken)
  console.log(token)
  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
