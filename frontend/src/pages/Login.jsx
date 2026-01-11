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
        <div className="min-h-screen flex overflow-hidden bg-gradient-to-r from-[rgb(240,244,242)] via-[rgb(216,243,232)] to-[rgb(240,244,242)]">
            

            {/* Left Section - White Card */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 pt-24">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-[rgb(226,232,240)] backdrop-blur transform transition-all duration-500 hover:shadow-xl">
                        {/* Welcome Text */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-[rgb(27,67,50)] italic mb-6">
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
                                className="w-full bg-[rgb(248,250,249)] border-2 border-[rgb(226,232,240)] rounded-full px-4 py-3 focus:border-[rgb(45,106,79)] focus:bg-white outline-none text-[rgb(15,23,42)] placeholder-[rgb(100,116,139)] transition-all duration-200 text-sm"
                            />

                            {/* Password Section */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-[rgb(248,250,249)] border-2 border-[rgb(226,232,240)] rounded-full px-4 py-3 pr-10 focus:border-[rgb(45,106,79)] focus:bg-white outline-none text-[rgb(15,23,42)] placeholder-[rgb(100,116,139)] transition-all duration-200 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(100,116,139)] hover:text-[rgb(15,23,42)] transition-colors"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-[rgb(45,106,79)] text-xs font-semibold hover:text-[rgb(27,67,50)] transition-colors duration-200"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[rgb(45,106,79)] text-white font-bold py-3 rounded-full hover:bg-[rgb(27,67,50)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        
                        {/* Sign Up Link */}
                        <p className="text-center mt-6 text-[rgb(100,116,139)] text-sm">
                            Not a member?{" "}
                            <Link
                                to="/register"
                                className="text-[rgb(45,106,79)] font-bold hover:text-[rgb(27,67,50)] hover:underline transition-colors duration-200"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(27,67,50)]/30 to-transparent opacity-40"></div>
            </div>
        </div>
    );
};

export default Login;
