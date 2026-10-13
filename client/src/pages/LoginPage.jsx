import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
  });

  const [currState, setCurrState] = useState("Login");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setIsLoading(true);

    const credentialsPayload = {
      email: formData.email.trim(),
      password: formData.password,
    };

    if (currState === "Sign up") {
      credentialsPayload.fullName = formData.fullName.trim();
      credentialsPayload.bio = formData.bio.trim();
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
    setShowPassword(false);
    setFormData({ fullName: "", email: "", password: "", bio: "" });
  };

  return (
    /* ✅ NEW GRADIENT BACKGROUND APPLIED HERE VIA TAILWIND */
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col transition-all duration-500">
      
      {/* ----------- Left Column: Branding -------- */}
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src={assets.logo_big}
          alt="Logo"
          className="w-[min(30vw,250px)] animate-pulse mb-4"
        />
      </div>

      {/* --------- Right Column: Form Block --------- */}
      <form
        onSubmit={onSubmitHandler}
        className="border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl text-white p-6 flex flex-col gap-6 rounded-lg shadow-2xl min-w-[320px] transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
      >
        <div className="flex justify-between items-center w-full">
          <h2 className="font-medium text-2xl tracking-wide">{currState}</h2>
          {currState === "Sign up" && isDataSubmitted && (
            <button
              type="button"
              onClick={() => !isLoading && setIsDataSubmitted(false)}
              className="focus:outline-none"
            >
              <img
                src={assets.arrow_icon}
                alt="Back arrow"
                className="w-5 cursor-pointer hover:scale-110 transition-transform duration-200"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Step 1: Full Name (Sign Up Only) */}
          {currState === "Sign up" && !isDataSubmitted && (
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className="p-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white transition-all duration-200"
              placeholder="Full Name"
              required
            />
          )}

          {/* Email & Password Input block */}
          {(currState === "Login" || !isDataSubmitted) && (
            <>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="p-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white transition-all duration-200"
              />

              <div className="relative w-full flex items-center">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full p-2 pr-10 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step 2: Bio Textarea (Sign Up Conditional Step) */}
          {currState === "Sign up" && isDataSubmitted && (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="p-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950/40 text-white resize-none transition-all duration-200"
              placeholder="Provide a short bio..."
              required
            ></textarea>
          )}
        </div>

        {/* Action Form Submit Trigger button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden shadow-md ${
            isLoading
              ? "opacity-75 cursor-not-allowed"
              : "cursor-pointer hover:from-purple-600 hover:to-indigo-700 active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>
              {currState === "Login" ? "Login" : isDataSubmitted ? "Create Account" : "Next"}
            </span>
          )}
        </button>

        {/* Switch Auth Context States Footer */}
        <div className="text-center text-sm text-slate-400 mt-2">
          {currState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => switchState("Sign up")}
                className="text-indigo-400 font-medium hover:underline cursor-pointer transition-colors hover:text-indigo-300"
              >
                Sign up now
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => switchState("Login")}
                className="text-indigo-400 font-medium hover:underline cursor-pointer transition-colors hover:text-indigo-300"
              >
                Login
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
