import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            // Response returns JWT token
            const token = response.data.access_token;

            login(token);
            navigate("/notes");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden bg-gradient-to-r from-euca-50 via-emerald-50 to-euca-100">
            

            {/* Left Section - White Card */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 pt-24">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-euca-100 backdrop-blur transform transition-all duration-500 hover:shadow-xl">
                        {/* Welcome Text */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-euca-700 italic mb-6">
                            Welcome
                        </h1>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-pulse">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email Input */}
                            <input
                                type="email"
                                placeholder="username@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-50 border-2 border-euca-200 rounded-full px-4 py-3 focus:border-euca-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all duration-200 text-sm"
                            />

                            {/* Password Section */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border-2 border-euca-200 rounded-full px-4 py-3 pr-10 focus:border-euca-500 focus:bg-white outline-none text-slate-900 placeholder-slate-400 transition-all duration-200 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-euca-700 text-xs font-semibold hover:text-euca-600 transition-colors duration-200"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-euca-600 text-white font-bold py-3 rounded-full hover:bg-euca-500 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        
                        {/* Sign Up Link */}
                        <p className="text-center mt-6 text-slate-600 text-sm">
                            Not a member?{" "}
                            <Link
                                to="/register"
                                className="text-euca-700 font-bold hover:text-euca-600 hover:underline transition-colors duration-200"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Background Image */}
            <div
                className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden"
                style={{
                    backgroundImage: `url('/bgimage.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-euca-700/30 to-transparent opacity-40"></div>
            </div>
        </div>
    );
};

export default Login;
