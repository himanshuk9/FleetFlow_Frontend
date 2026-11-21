
import { useState } from "react";
import "./Signup.css";

const API_URL = "http://127.0.0.1:8000";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Please check your details and try again."
        );
      }

      setMessage("Account created successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Check your FastAPI backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-brand">
          <div className="signup-logo">F</div>
          <span>FleetFlow</span>
        </div>

        <div className="signup-heading">
          <p className="signup-eyebrow">GET STARTED</p>
          <h1>Create your account</h1>
          <p>Manage your fleet smarter with FleetFlow.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              maxLength={100}
              autoComplete="name"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Account Role Selection */}
          <div className="signup-field">
            <label htmlFor="role">Create account as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Normal User</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="signup-alert signup-error" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="signup-alert signup-success" role="status">
              {message}
            </div>
          )}

          <button
            className="signup-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <a href="/login">Sign in</a>
        </p>

        <div className="signup-security">
          <span aria-hidden="true">✓</span>
          Your account details are securely submitted.
        </div>
      </div>

      <aside className="signup-side">
        <div className="side-content">
          <span className="side-badge">FLEET MANAGEMENT PLATFORM</span>
          <h2>
            Your fleet.
            <br />
            Your control.
          </h2>
          <p>
            Simplify vehicle operations, organize drivers,
            and keep your fleet moving with FleetFlow.
          </p>

          <div className="side-stats">
            <div>
              <strong>Vehicles</strong>
              <span>Track your fleet</span>
            </div>
            <div>
              <strong>Drivers</strong>
              <span>Manage your team</span>
            </div>
            <div>
              <strong>Operations</strong>
              <span>One central platform</span>
            </div>
          </div>
        </div>

        <div className="side-decoration" aria-hidden="true">
          FF
        </div>
      </aside>
    </div>
  );
}

export default Signup;
