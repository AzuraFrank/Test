import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ currentScreen, onNavigate, onShowLogin }) => {
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { id: "home", label: "Beranda", icon: "fas fa-home", public: true },
    { id: "library", label: "Lagu", icon: "fas fa-music", public: true },
    { id: "record", label: "Rekam", icon: "fas fa-microphone", auth: true },
    {
      id: "tournaments",
      label: "Tournament",
      icon: "fas fa-trophy",
      auth: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-chart-line",
      auth: true,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate("home");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header style={headerStyles.container}>
      <div className="container">
        <div style={headerStyles.content}>
          {/* Logo */}
          <div style={headerStyles.logo} onClick={() => onNavigate("home")}>
            <i className="fas fa-microphone" style={headerStyles.logoIcon}></i>
            <div style={headerStyles.logoText}>
              <h1 style={headerStyles.title}>Nabila Portal</h1>
              <span style={headerStyles.subtitle}>Karaoke</span>
            </div>
          </div>

          {/* Navigation */}
          <nav style={headerStyles.nav}>
            {navItems.map((item) => {
              // Hide auth-required items if not logged in
              if (item.auth && !user) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    ...headerStyles.navItem,
                    ...(currentScreen === item.id
                      ? headerStyles.navItemActive
                      : {}),
                  }}
                  className="btn-secondary"
                >
                  <i className={item.icon}></i>
                  <span style={headerStyles.navLabel}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div style={headerStyles.userActions}>
            {user ? (
              <div style={headerStyles.userMenu}>
                {/* User Profile */}
                <div style={headerStyles.userInfo}>
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email)}&background=ff6b6b&color=fff`
                    }
                    alt="Avatar"
                    style={headerStyles.avatar}
                  />
                  <div style={headerStyles.userDetails}>
                    <span style={headerStyles.userName}>
                      {user.user_metadata?.full_name ||
                        user.email.split("@")[0]}
                    </span>
                    {isAdmin && (
                      <span style={headerStyles.adminBadge}>Admin</span>
                    )}
                  </div>
                </div>

                {/* Admin Panel Access */}
                {isAdmin && (
                  <button
                    onClick={() => onNavigate("admin")}
                    className="btn"
                    style={headerStyles.adminButton}
                  >
                    <i className="fas fa-user-shield"></i>
                    Admin Panel
                  </button>
                )}

                {/* Profile & Settings */}
                <button
                  onClick={() => onNavigate("profile")}
                  className="btn btn-secondary"
                  style={headerStyles.profileButton}
                >
                  <i className="fas fa-user"></i>
                  Profil
                </button>

                {/* Payment */}
                <button
                  onClick={() => onNavigate("payment")}
                  className="btn"
                  style={headerStyles.paymentButton}
                >
                  <i className="fas fa-crown"></i>
                  Premium
                </button>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="btn"
                  style={headerStyles.signOutButton}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Keluar
                </button>
              </div>
            ) : (
              <div style={headerStyles.authButtons}>
                <button
                  onClick={onShowLogin}
                  className="btn btn-primary"
                  style={headerStyles.loginButton}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const headerStyles = {
  container: {
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  logoIcon: {
    fontSize: "32px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitle: {
    fontSize: "12px",
    opacity: 0.8,
    fontWeight: "500",
    marginTop: "2px",
  },
  nav: {
    display: "flex",
    gap: "12px",
    flex: 1,
    justifyContent: "center",
  },
  navItem: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "12px",
    padding: "8px 16px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  navItemActive: {
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transform: "scale(1.05)",
  },
  navLabel: {
    fontSize: "13px",
  },
  userActions: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: "13px",
    fontWeight: "600",
    lineHeight: 1,
  },
  adminBadge: {
    fontSize: "10px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    padding: "2px 6px",
    borderRadius: "8px",
    fontWeight: "600",
    marginTop: "2px",
  },
  adminButton: {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  profileButton: {
    padding: "6px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  paymentButton: {
    background: "linear-gradient(45deg, #feca57, #ff9ff3)",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  signOutButton: {
    background: "rgba(244, 67, 54, 0.2)",
    color: "#f44336",
    border: "1px solid rgba(244, 67, 54, 0.3)",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  authButtons: {
    display: "flex",
    gap: "10px",
  },
  loginButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default Header;
