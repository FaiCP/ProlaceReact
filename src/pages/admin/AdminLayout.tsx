import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const links = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/products", label: "Productos", icon: "inventory_2" },
  { to: "/admin/orders", label: "Pedidos", icon: "shopping_cart" },
  { to: "/admin/users", label: "Usuarios", icon: "group" },
  { to: "/admin/messages", label: "Mensajes", icon: "forum" },
  { to: "/admin/applications", label: "Postulaciones", icon: "person_search" },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ background: "var(--color-surface)" }}>
      {/* Sidebar */}
      <aside
        className="h-screen w-64 fixed left-0 top-0 flex flex-col py-6 z-50"
        style={{ background: "var(--color-surface-low)", borderRight: "1px solid var(--color-outline-variant)" }}
      >
        {/* Logo */}
        <div className="px-8 mb-8">
          <span
            className="text-xl font-extrabold"
            style={{
              fontFamily: "var(--font-headline)",
              background: "linear-gradient(135deg, #00677d, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PROLACE
          </span>
          <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-outline)" }}>
            Panel de Administración
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 pl-4 pr-0">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 py-3 px-4 rounded-l-full font-bold text-sm transition-all"
                  : "flex items-center gap-3 py-3 px-4 font-medium text-sm transition-all hover:translate-x-1"
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: "var(--color-surface-bright)",
                      color: "var(--color-primary)",
                      boxShadow: "0 2px 12px -4px rgba(0,103,125,0.12)",
                    }
                  : { color: "var(--color-on-surface-muted)" }
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to site */}
        <div className="px-6 mb-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xs font-medium transition-colors"
            style={{ color: "var(--color-outline)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            Ir al sitio
          </NavLink>
        </div>

        {/* Profile card */}
        <div className="px-4">
          <div
            className="p-3 rounded-2xl flex items-center gap-3"
            style={{ background: "var(--color-surface-mid)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--color-on-surface)" }}>
                {user?.displayName ?? user?.email ?? "Admin"}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
                Administrador
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="material-symbols-outlined transition-colors shrink-0"
              style={{ fontSize: "18px", color: "var(--color-outline)" }}
              title="Cerrar sesión"
            >
              logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 ml-64 overflow-y-auto min-h-screen"
        style={{ background: "var(--color-surface)" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
