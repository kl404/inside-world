import React from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Logout() {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  if (location.pathname === "/") {
    return (
      <Link to="/dashboard">
        <Button text="Go to dashboard" />
      </Link>
    );
  }

  return <Button text="Logout" clickHandler={logout} />;
}
