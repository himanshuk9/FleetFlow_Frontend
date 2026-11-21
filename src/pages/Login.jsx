
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/login",
                formData
            );

            const data = response.data;

            // Save JWT and user details
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
            }));

            // Navigate according to user role
            if (data.role === "admin") {
                navigate("/Admin");
            } else if (data.role === "driver") {
                navigate("/driver-dashboard");
            } else {
                navigate("/UserDashboard");
            }

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-brand">
                    <div className="login-logo">F</div>
                    <h1>Fleet<span>Flow</span></h1>
                    <p>Smart Fleet Management System</p>
                </div>

                <div className="login-heading">
                    <h2>Welcome back!</h2>
                    <p>Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="signup-link"
                            onClick={() => navigate("/signup")}
                        >
                            Create account
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Login;
