import { useState } from "react";

function Navbar({ activeSection, onNavigate, user, onLogout, onClearData, onDeleteAccount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = (section) => { onNavigate(section); setMobileOpen(false); };

  return (
    <header className="topbar">
      <a className="topbar-brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate("dashboard"); }}>
        <span className="topbar-mark">✦</span>
        <span className="topbar-brand-copy">Resume<span>AI</span><small>SMART SCREENING</small></span>
      </a>
      <button className="mobile-nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? "×" : "☰"}</button>
      <nav className={`topbar-links ${mobileOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
        {[
          ["dashboard", "Dashboard", "⌂"],
          ["screen", "Screen resume", "▤"],
          ["candidates", "Candidates", "♙"],
          ["analytics", "Analytics", "◈"]
        ].map(([section, label, icon]) => (
          <button key={section} type="button" className={activeSection === section ? "topbar-link active" : "topbar-link"} onClick={() => navigate(section)}>
            <span aria-hidden="true">{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <div className="workspace-status"><span /> AI workspace</div>
        <div className="account-wrap">
          <button className="account-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
            <span className="account-avatar">{user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}</span>
            <span className="account-name">{user?.name || "My account"}<small>Workspace</small></span>
            <span className="account-chevron">⌄</span>
          </button>
          {menuOpen && (
            <>
              <button className="menu-dismiss" aria-label="Close account menu" onClick={() => setMenuOpen(false)} />
              <div className="account-menu">
                <div className="account-menu-user"><strong>{user?.name}</strong><span>{user?.email}</span></div>
                <button type="button" onClick={() => { setMenuOpen(false); onClearData(); }}>↻ &nbsp; Clear screening history</button>
                <button type="button" className="danger-action" onClick={() => { setMenuOpen(false); onDeleteAccount(); }}>⌫ &nbsp; Delete account</button>
                <div className="account-menu-divider" />
                <button type="button" onClick={() => { setMenuOpen(false); onLogout(); }}>↗ &nbsp; Sign out</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
