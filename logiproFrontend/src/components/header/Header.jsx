import UserProfileMenu from "./UserProfileMenu";

export default function Header() {
  return (
    <header className="border-bottom bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between py-2">
        {/* Branding / Logo */}
        <div className="fw-bold">LogiPro</div>

        {/* Solo el perfil */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
