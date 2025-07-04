import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_CONFIG } from "../config/supabase";

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUp(email, password, {
          full_name: fullName,
          avatar_url: "",
          bio: "",
          level: 1,
          xp: 0,
        });
      }
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail(ADMIN_CONFIG.ADMIN_EMAIL);
    setPassword(ADMIN_CONFIG.ADMIN_PASSWORD);
    setIsLogin(true);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="card">
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isLogin ? "🎤 Masuk ke Nabila Portal" : "🌟 Daftar Nabila Portal"}
          </h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            className="btn-secondary"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={styles.loginOptions}>
          <p style={styles.optionsText}>
            {isLogin ? "Pilih cara masuk:" : "Pilih cara daftar:"}
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={styles.submitButton}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Memproses...
              </>
            ) : (
              <>{isLogin ? "Masuk" : "Daftar"}</>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span>atau</span>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="btn btn-secondary"
          style={styles.googleButton}
        >
          <i className="fab fa-google"></i>
          {isLogin ? "Masuk dengan Gmail" : "Daftar dengan Gmail"}
        </button>

        <div style={styles.adminSection}>
          <h4 style={styles.adminTitle}>👨‍💼 Akses Admin</h4>
          <p style={styles.adminDesc}>
            Khusus untuk admin Nabila Portal. Gunakan akun admin yang telah
            terdaftar.
          </p>
          <button
            onClick={handleAdminLogin}
            className="btn"
            style={styles.adminButton}
          >
            <i className="fas fa-user-shield"></i>
            Masuk sebagai Admin
          </button>
          <p style={styles.adminNote}>Email: jesikamahjong@gmail.com</p>
        </div>

        <div style={styles.switchMode}>
          {isLogin ? (
            <p>
              Belum punya akun?{" "}
              <button
                onClick={() => setIsLogin(false)}
                style={styles.linkButton}
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button
                onClick={() => setIsLogin(true)}
                style={styles.linkButton}
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  },
  modal: {
    maxWidth: "400px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  closeButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    cursor: "pointer",
  },
  error: {
    background: "rgba(244, 67, 54, 0.2)",
    border: "1px solid #f44336",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    color: "#f44336",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  form: {
    marginBottom: "25px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  submitButton: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "600",
  },
  divider: {
    textAlign: "center",
    margin: "25px 0",
    position: "relative",
    color: "rgba(255,255,255,0.6)",
  },
  googleButton: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  loginOptions: {
    textAlign: "center",
    marginBottom: "20px",
  },
  optionsText: {
    fontSize: "0.95rem",
    opacity: 0.8,
    marginBottom: "15px",
  },
  adminSection: {
    textAlign: "center",
    marginBottom: "20px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  adminTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "10px",
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  adminDesc: {
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "15px",
    lineHeight: 1.4,
  },
  adminNote: {
    fontSize: "0.8rem",
    opacity: 0.6,
    marginTop: "8px",
    fontStyle: "italic",
  },
  adminButton: {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "15px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 auto",
  },
  switchMode: {
    textAlign: "center",
    fontSize: "14px",
    opacity: 0.8,
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#feca57",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "inherit",
  },
};

export default Login;
