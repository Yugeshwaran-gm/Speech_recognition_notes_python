import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

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
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account? <a href="/register">Signup</a>
            </p>
        </div>
    );
};

export default Login;
