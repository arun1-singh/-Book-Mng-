import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/register", formData);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            <div style={styles.iconWrap}>📖</div>
            <h1 style={styles.brandTitle}>Join Us Today</h1>
            <p style={styles.brandSub}>Create your account and start managing your book collection</p>
            <ul style={styles.featureList}>
              <li>✅ Add & manage books</li>
              <li>✅ Search & filter</li>
              <li>✅ Secure & private</li>
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.rightPanel}>
          <div style={styles.formWrap}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Fill in the details below</p>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success py-2 small" role="alert">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">👤</span>
                  <input
                    type="text"
                    name="username"
                    className="form-control border-start-0 ps-0"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">✉️</span>
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
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Create a strong password"
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
                    Creating account...
                  </>
                ) : "Create Account →"}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center text-muted small mb-0">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={styles.link}
              >
                Sign in
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
    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    padding: "1rem",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    maxWidth: "900px",
    minHeight: "560px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#fff",
  },
  leftPanel: {
    flex: "1",
    background: "linear-gradient(160deg, #059669 0%, #10b981 100%)",
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
    fontSize: "0.9rem",
    opacity: "0.9",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    textAlign: "left",
    fontSize: "0.9rem",
    lineHeight: "2",
    opacity: "0.95",
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
    color: "#064e3b",
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
    background: "linear-gradient(135deg, #059669, #10b981)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    letterSpacing: "0.3px",
  },
  link: {
    color: "#059669",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Register;
