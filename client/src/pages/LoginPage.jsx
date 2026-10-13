import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // ✅ NEW STATE FOR SHOW/HIDE PASSWORD VISIBILITY
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setIsLoading(true);

    const credentialsPayload = {
      email: email.trim(),
      password: password,
    };

    if (currState === "Sign up") {
      credentialsPayload.fullName = fullName.trim();
      credentialsPayload.bio = bio.trim();
    }

    try {
      await login(currState, credentialsPayload);
    } catch (error) {
      console.error("Login Page Submit Exception:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchState = (targetState) => {
    if (isLoading) return;
    setCurrState(targetState);
    setIsDataSubmitted(false);
    setEmail("");
    setPassword("");
    setFullName("");
    setBio("");
    setShowPassword(false); // Reset visibility when swapping views
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl transition-all duration-500">
      {/* ----------- left -------- */}
      <img
        src={assets.logo_big}
        alt="Logo"
        className="w-[min(30vw,250px)] animate-pulse"
      />

      {/* --------- right --------- */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-slate-900/40 backdrop-blur-xl text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg min-w-[320px] transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center tracking-wide">
          {currState}
          {currState === "Sign up" && isDataSubmitted && (
            <img
              onClick={() => !isLoading && setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back arrow"
              className="w-5 cursor-pointer hover:scale-110 transition-transform duration-200"
            />
          )}
        </h2>

        <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out opacity-100">
          {currState === "Sign up" && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white transition-all duration-200"
              placeholder="Full Name"
              required
            />
          )}

          {(currState === "Login" || !isDataSubmitted) && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white transition-all duration-200"
              />

              {/* ✅ POSITION CONTAINER FOR RELATIVE TOGGLE EYE LAYOUT */}
              <div className="relative w-full flex items-center">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  // Changed dynamically between 'text' and 'password' visibility formats
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full p-2 pr-10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer select-none"
                >
                  {showPassword ? (
                    /* Dynamic Minimalist Eye Open Icon */
                    <svg
                      xmlns="http://w3.org"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    /* Dynamic Minimalist Eye Closed Slash Icon */
                    <svg
                      xmlns="http://w3.org"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}

          {currState === "Sign up" && isDataSubmitted && (
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white resize-none transition-all duration-200"
              placeholder="Provide a short bio..."
              required
            ></textarea>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden shadow-md ${
            isLoading
              ? "opacity-75 cursor-not-allowed"
              : "cursor-pointer hover:from-purple-500 hover:to-violet-700 active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>
              {currState === "Sign up"
                ? isDataSubmitted
                  ? "Create Account"
                  : "Continue"
                : "Login Now"}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400 select-none">
          <input
            type="checkbox"
            required
            className="cursor-pointer accent-violet-600"
          />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-gray-700/50 transition-all duration-300">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-400">
              Already have an Account?{" "}
              <span
                className="font-medium text-violet-400 cursor-pointer hover:underline transition-all"
                onClick={() => switchState("Login")}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Don't have an Account?{" "}
              <span
                className="font-medium text-violet-400 cursor-pointer hover:underline transition-all"
                onClick={() => switchState("Sign up")}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
