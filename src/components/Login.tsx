import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState("");

  const { login, signup, isLoading, error } = useAuth();

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      if (!email || !password) {
        setStatus("empty");
      } else if (password.length < 6) {
        setStatus("short");
      }
      return;
    }

    if (isRegister && password !== passwordConfirm) {
      setStatus("mismatch");
      return;
    }

    try {
      if (isRegister) {
        console.log("Signing up a new user");
        await signup(email, password, passwordConfirm);
      } else {
        console.log("Logging in existing user");
        await login(email, password);
      }
    } catch (err: unknown) {
      console.log((err as { message: string }).message);
      if ((err as { message: string }).message.includes("invalid-email")) {
        setStatus("invalidEmail");
      } else if ((err as { message: string }).message.includes("auth")) {
        setStatus("authError");
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className="text-4xl sm:text-5xl md:text-6xl fugaz-font">
        {isRegister ? "Register" : "Log In"}
      </h3>
      <p>You're one step away!</p>
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
        placeholder="Password"
        type="password"
      />
      {isRegister && (
        <input
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
          }}
          className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none"
          placeholder="Confirm Password"
          type="password"
        />
      )}
      <div className="max-w-[400px] w-full mx-auto">
        <Button
          clickHandler={handleSubmit}
          text={isLoading ? "Submitting" : "Submit"}
          full
        />
      </div>
      <p className="text-center text-red-500">
        {status === "empty" ? "Please fill in all fields" : ""}
        {status === "short" ? "Password must be at least 6 characters" : ""}
        {status === "invalidEmail" ? "Invalid email address" : ""}
        {status === "mismatch" ? "Passwords do not match" : ""}
        {status === "authError"
          ? "Authentication failed, please check your input"
          : ""}
        {error && !status ? error : ""}
      </p>

      <p className="text-center">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setStatus("");
          }}
          className="text-indigo-600"
        >
          {isRegister ? "Log in" : "Register"}
        </button>
      </p>
    </div>
  );
}
