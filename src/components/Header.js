import React from "react";

const Header = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: "home", label: "Home", icon: "fas fa-home" },
    { id: "library", label: "Songs", icon: "fas fa-music" },
    { id: "record", label: "Record", icon: "fas fa-microphone" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

  return (
    <header style={headerStyles.container}>
      <div className="container">
        <div style={headerStyles.content}>
          <div style={headerStyles.logo}>
            <i className="fas fa-microphone" style={headerStyles.logoIcon}></i>
            <h1 style={headerStyles.title}>KaraokeMax</h1>
          </div>

          <nav style={headerStyles.nav}>
            {navItems.map((item) => (
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
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

const headerStyles = {
  container: {
    background: "rgba(0,0,0,0.2)",
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
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "28px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  navItem: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "15px",
    padding: "10px 15px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
  },
  navItemActive: {
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    transform: "scale(1.05)",
  },
  navLabel: {
    marginLeft: "8px",
  },
};

export default Header;
