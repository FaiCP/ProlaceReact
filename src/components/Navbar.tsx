import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav
      className="fixed top-0 w-full z-50 glass-nav"
      style={{
        backgroundColor: "rgba(255,255,255,0.82)",
        boxShadow: "0 10px 40px -15px rgba(0,180,216,0.12)",
        borderBottom: "1px solid rgba(188,201,206,0.3)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: "72px" }}>
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight"
          style={{
            fontFamily: "var(--font-headline)",
            background: "linear-gradient(135deg, #00677d, #00b4d8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          PROLACE
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "var(--font-headline)", fontWeight: 600 }}>
          <Link
            to="/products"
            className="text-sm transition-colors duration-200"
            style={{
              color: isActive("/products") ? "var(--color-primary)" : "var(--color-on-surface-muted)",
              borderBottom: isActive("/products") ? "2px solid var(--color-primary)" : "2px solid transparent",
              paddingBottom: "2px",
            }}
          >
            Catálogo
          </Link>
          <Link
            to="/jobs"
            className="text-sm transition-colors duration-200"
            style={{
              color: isActive("/jobs") ? "var(--color-primary)" : "var(--color-on-surface-muted)",
              borderBottom: isActive("/jobs") ? "2px solid var(--color-primary)" : "2px solid transparent",
              paddingBottom: "2px",
            }}
          >
            Vacantes
          </Link>
          <Link
            to="/contact"
            className="text-sm transition-colors duration-200"
            style={{
              color: isActive("/contact") ? "var(--color-primary)" : "var(--color-on-surface-muted)",
              borderBottom: isActive("/contact") ? "2px solid var(--color-primary)" : "2px solid transparent",
              paddingBottom: "2px",
            }}
          >
            Contacto
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "usuario" && (
                <Link
                  to="/orders"
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--color-on-surface-muted)" }}
                >
                  Mis pedidos
                </Link>
              )}
              {user.role === "aspirante" && (
                <Link
                  to="/applications"
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--color-on-surface-muted)" }}
                >
                  Mis postulaciones
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  Admin
                </Link>
              )}
              <span className="text-sm" style={{ color: "var(--color-outline)" }}>
                {user.displayName ?? user.email ?? user.id}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-full border transition-colors"
                style={{
                  color: "var(--color-on-surface-muted)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--color-on-surface-muted)" }}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold px-5 py-2.5 rounded-full transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #00677d, #00b4d8)",
                  color: "#fff",
                }}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
