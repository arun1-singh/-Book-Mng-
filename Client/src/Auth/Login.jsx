import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("token", response.data.access_token);
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="shadow-lg">

        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <div style={styles.iconWrap}>📚</div>
            <h1 style={styles.brandTitle}>Book Management</h1>
            <p style={styles.brandSub}>Manage your library with ease</p>
            <div style={styles.dots}>
              <span style={{...styles.dot, background:"rgba(255,255,255,0.9)"}}></span>
              <span style={{...styles.dot, background:"rgba(255,255,255,0.5)"}}></span>
              <span style={{...styles.dot, background:"rgba(255,255,255,0.3)"}}></span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrap}>
            <h2 style={styles.title}>Welcome back</h2>
            <p style={styles.subtitle}>Sign in to your account</p>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <span>✉️</span>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <span>🔒</span>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-100 fw-semibold py-2"
                style={styles.submitBtn}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Signing in...
                  </>
                ) : "Sign In →"}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                style={styles.link}
              >
                Create one
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    maxWidth: "860px",
    minHeight: "520px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#fff",
  },
  leftPanel: {
    flex: "1",
    background: "linear-gradient(160deg, #4f46e5 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem",
    minWidth: "0",
  },
  leftContent: {
    textAlign: "center",
    color: "#fff",
  },
  iconWrap: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
  },
  brandTitle: {
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "#fff",
  },
  brandSub: {
    fontSize: "0.95rem",
    opacity: "0.85",
    marginBottom: "2rem",
  },
  dots: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },
  rightPanel: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem",
    minWidth: "0",
  },
  formWrap: {
    width: "100%",
    maxWidth: "360px",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e1b4b",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  input: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    letterSpacing: "0.3px",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
