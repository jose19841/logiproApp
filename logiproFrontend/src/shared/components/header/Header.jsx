import UserProfileMenu from "@shared/components/header/UserProfileMenu";
import "./header.css";

export default function Header() {
  return (
    <header className="app-header border-bottom">
      <div className="container-fluid d-flex align-items-center justify-content-between header-inner">
        {/* Branding / Logo */}
        <div className="d-flex align-items-center gap-2">
          <img
            src="/img/logipro.png"
            alt="LogiPro"
            className="app-logo"
          />
        </div>

        {/* Menú de perfil */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
