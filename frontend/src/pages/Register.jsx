import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CreditCard,
  BarChart3,
} from "lucide-react";
import ThreeBackground from "../components/ThreeBackground";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Animated Background */}
      <ThreeBackground />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8 xl:px-12 text-white">
          <div
            className={`transform transition-all duration-1000 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <h1 className="text-4xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              Join FinanceHub
            </h1>
            <p className="text-lg xl:text-xl mb-12 text-gray-200 leading-relaxed">
              Start your journey to financial freedom with our comprehensive
              suite of tools and insights.
            </p>

            <div className="space-y-8">
              <div
                className={`flex items-center space-x-4 transform transition-all duration-1000 delay-200 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
              >
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-2xl shadow-lg shadow-purple-500/25">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Easy Setup</h3>
                  <p className="text-gray-300">
                    Get started in minutes with our guided setup
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-4 transform transition-all duration-1000 delay-400 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
              >
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-2xl shadow-lg shadow-pink-500/25">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Smart Budgeting</h3>
                  <p className="text-gray-300">
                    AI-powered budgeting and expense tracking
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center space-x-4 transform transition-all duration-1000 delay-600 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/25">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                  <p className="text-gray-300">
                    Detailed reports and financial projections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8">
          <div
            className={`max-w-md w-full transform transition-all duration-1000 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/[0.08] ring-1 ring-white/[0.05]">
              {/* Logo for mobile */}
              <div className="lg:hidden text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-3">
                    <span className="text-2xl font-bold text-white">F</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
                    FinanceHub
                  </h1>
                </div>
                <p className="text-gray-200 text-sm sm:text-base">
                  Create your account
                </p>
              </div>

              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-gray-200">
                  Join thousands of smart investors
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 backdrop-blur border border-red-400/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 text-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 focus:bg-slate-800/70 transition-all duration-300 placeholder-slate-400"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 text-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 focus:bg-slate-800/70 transition-all duration-300 placeholder-slate-400"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 text-slate-100 pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 focus:bg-slate-800/70 transition-all duration-300 placeholder-slate-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-800/50 backdrop-blur border border-slate-600/50 text-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 focus:bg-slate-800/70 transition-all duration-300 placeholder-slate-400"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-300 underline underline-offset-4 decoration-purple-400/30 hover:decoration-purple-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
