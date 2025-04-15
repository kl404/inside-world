import React from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function CallToAction() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return (
      <div className="max-w-[600px] mx-auto w-full">
        <Link to="/dashboard">
          <Button dark full text="Go to dashboard" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-fit mx-auto flex gap-4">
      <div className="grid grid-cols-2 gap-4 w-fit mx-auto">
        <Link to="/dashboard">
          <Button text="Sign up" />
        </Link>
        <Link to="/dashboard">
          <Button text="Log in" dark />
        </Link>
      </div>
    </div>
  );
}
