import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdMovie } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../src/services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("token", response.data.token);
      setMessage("User logged in successfully");
      
      // Check for redirect URL in localStorage
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin'); // Clean up
      
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md bg-zinc-800/90 rounded-xl shadow-lg border border-zinc-700 p-8">
        <div className="text-center mb-12">
          <MdMovie className="text-indigo-500 text-6xl mb-8" />
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-zinc-400 text-lg">Sign in to continue to Entertainment Hub</p>
        </div>

        {message && (
          <div className={`text-center py-4 rounded-xl mb-8 ${
            message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}>
            <p className="text-center">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-indigo-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 active:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500"
              disabled={!email || !password}
            >
              Sign in
            </button>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-zinc-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-500 hover:text-indigo-600">
                Sign up
              </Link>
            </p>
            <div className="border-t border-zinc-700 pt-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Homepage
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
