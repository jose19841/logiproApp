import UserProfileMenu from "@shared/components/header/UserProfileMenu";
import "./header.css";

export default function Header() {
  return (
    <header className="app-header border-bottom">
      <div className="container-fluid d-flex align-items-center justify-content-between header-inner">
        {/* Branding / Logo */}
        <div className="d-flex align-items-center gap-3 logo-container">
          <img
            src="/img/logipro.png"
            alt="LogiPro"
            className="app-logo"
          />
          <div className="brand-text">
            <div className="brand-name">LogiPro</div>
            <div className="brand-tagline">Sistema de Gestión</div>
          </div>
        </div>

        {/* Menú de perfil */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
