import UserProfileMenu from "./UserProfileMenu";

export default function Header() {
  return (
    <header className="border-bottom bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between py-2">
        {/* Branding / Logo */}
        <div className="d-flex align-items-center">
          <img
            src="/img/logipro.png"
            alt="LogiPro"
            style={{
              height: "65px", // ajustá este valor según el tamaño que quieras en el header
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Solo el perfil */}
        <UserProfileMenu />
      </div>
    </header>
  );
}
