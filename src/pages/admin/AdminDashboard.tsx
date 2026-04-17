import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

const today = new Date().toLocaleDateString("es-CO", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

export default function AdminDashboard() {
  const { data: products } = useQuery({ queryKey: ["admin-products-count"], queryFn: () => api.get("/products?limit=1").then(r => r.data) });
  const { data: orders } = useQuery({ queryKey: ["admin-orders-count"], queryFn: () => api.get("/orders?limit=1").then(r => r.data) });
  const { data: users } = useQuery({ queryKey: ["admin-users-count"], queryFn: () => api.get("/admin/users?limit=1").then(r => r.data) });
  const { data: messages } = useQuery({ queryKey: ["admin-messages-count"], queryFn: () => api.get("/admin/messages?limit=1").then(r => r.data) });
  const { data: applications } = useQuery({ queryKey: ["admin-apps-count"], queryFn: () => api.get("/admin/applications?limit=1").then(r => r.data) });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: () => api.get("/orders?limit=5").then(r => r.data),
  });

  const { data: recentApps } = useQuery({
    queryKey: ["admin-recent-apps"],
    queryFn: () => api.get("/admin/applications?limit=3").then(r => r.data),
  });

  const { data: recentMsgs } = useQuery({
    queryKey: ["admin-recent-msgs"],
    queryFn: () => api.get("/admin/messages?limit=3").then(r => r.data),
  });

  const kpis = [
    {
      label: "Productos",
      value: products?.meta?.total ?? "—",
      icon: "inventory_2",
      accent: "var(--color-primary)",
      iconBg: "var(--color-primary-bg)",
      iconColor: "var(--color-primary)",
      href: "/admin/products",
    },
    {
      label: "Pedidos",
      value: orders?.meta?.total ?? "—",
      icon: "shopping_cart",
      accent: "var(--color-secondary)",
      iconBg: "var(--color-secondary-bg)",
      iconColor: "var(--color-secondary)",
      href: "/admin/orders",
    },
    {
      label: "Usuarios",
      value: users?.meta?.total ?? "—",
      icon: "group",
      accent: "#7c3aed",
      iconBg: "#ede9fe",
      iconColor: "#7c3aed",
      href: "/admin/users",
    },
    {
      label: "Postulaciones",
      value: applications?.meta?.total ?? "—",
      icon: "person_search",
      accent: "#d97706",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      href: "/admin/applications",
    },
  ];

  const ORDER_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    Pendiente:  { bg: "#fef3c7", color: "#92400e" },
    Despachado: { bg: "var(--color-primary-bg)", color: "var(--color-primary)" },
    Entregado:  { bg: "var(--color-secondary-bg)", color: "var(--color-secondary)" },
    Cancelado:  { bg: "#ffdad6", color: "#ba1a1a" },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: "var(--color-on-surface)" }}
          >
            Bienvenido, Admin
          </h2>
          <p className="mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
            Monitoreo y gestión del portal PROLACE.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full atmospheric-shadow shrink-0 capitalize"
          style={{ background: "var(--color-surface-bright)", color: "var(--color-on-surface)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-primary)" }}>
            calendar_today
          </span>
          <span className="text-sm font-semibold">{today}</span>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {kpis.map(({ label, value, icon, accent, iconBg, iconColor, href }) => (
          <Link
            key={label}
            to={href}
            className="rounded-2xl p-6 flex flex-col justify-between atmospheric-shadow transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--color-surface-bright)",
              borderLeft: `4px solid ${accent}`,
              minHeight: "120px",
            }}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium" style={{ color: "var(--color-on-surface-muted)" }}>
                {label}
              </span>
              <div className="p-2 rounded-xl" style={{ background: iconBg }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: iconColor }}>
                  {icon}
                </span>
              </div>
            </div>
            <p className="text-4xl font-extrabold mt-4" style={{ color: "var(--color-on-surface)" }}>
              {value}
            </p>
          </Link>
        ))}
      </div>

      {/* Messages unread badge */}
      {(messages?.meta?.total ?? 0) > 0 && (
        <Link
          to="/admin/messages"
          className="flex items-center gap-3 rounded-2xl p-4 mb-8 atmospheric-shadow transition-all hover:-translate-y-0.5"
          style={{ background: "var(--color-surface-bright)", borderLeft: "4px solid #7c3aed" }}
        >
          <div className="p-2 rounded-xl" style={{ background: "#ede9fe" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#7c3aed" }}>forum</span>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
              {messages?.meta?.total} mensaje{(messages?.meta?.total ?? 0) !== 1 ? "s" : ""} de contacto
            </p>
            <p className="text-xs" style={{ color: "var(--color-on-surface-muted)" }}>Ver todos →</p>
          </div>
        </Link>
      )}

      {/* Two-column: Orders + Applications/Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2/3) */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold" style={{ color: "var(--color-on-surface)" }}>
              Pedidos Recientes
            </h3>
            <Link to="/admin/orders" className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
              Ver todos →
            </Link>
          </div>
          <div
            className="rounded-2xl overflow-hidden atmospheric-shadow"
            style={{ background: "var(--color-surface-bright)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--color-surface-low)" }}>
                    {["ID", "Cliente", "Producto", "Cant.", "Estado"].map(h => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest"
                        style={{ color: "var(--color-on-surface-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8" style={{ color: "var(--color-outline)" }}>
                        Sin pedidos
                      </td>
                    </tr>
                  )}
                  {recentOrders?.data?.map((order: Record<string, unknown>) => {
                    const status = order.EstadoEntrega_pedido as string;
                    const style = ORDER_STATUS_STYLE[status] ?? { bg: "var(--color-surface-high)", color: "var(--color-outline)" };
                    return (
                      <tr
                        key={order.id_pedidos as number}
                        className="transition-colors"
                        style={{ borderTop: "1px solid var(--color-surface-high)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-low)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "")}
                      >
                        <td className="px-5 py-4 font-bold" style={{ color: "var(--color-primary)" }}>
                          #{order.id_pedidos as number}
                        </td>
                        <td className="px-5 py-4 font-medium" style={{ color: "var(--color-on-surface)" }}>
                          {(order.usuario as Record<string, unknown>)?.nombre as string}{" "}
                          {(order.usuario as Record<string, unknown>)?.apellido as string}
                        </td>
                        <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                          {order.tipoProducto_pedido as string}
                        </td>
                        <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                          {order.cantidad_pedido as number}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                            style={{ background: style.bg, color: style.color }}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right: Applications + Messages (1/3) */}
        <div className="space-y-8">
          {/* Recent Applications */}
          <section
            className="rounded-2xl p-6"
            style={{ background: "var(--color-surface-low)" }}
          >
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-primary)" }}>
                person_search
              </span>
              Postulaciones Recientes
            </h3>
            <div className="space-y-3">
              {recentApps?.data?.length === 0 && (
                <p className="text-sm text-center py-3" style={{ color: "var(--color-outline)" }}>Sin postulaciones</p>
              )}
              {recentApps?.data?.map((app: Record<string, unknown>) => {
                const aspirante = app.aspirante as Record<string, unknown>;
                return (
                  <div
                    key={app.id_postulacion as number}
                    className="rounded-xl p-4 atmospheric-shadow"
                    style={{
                      background: "var(--color-surface-bright)",
                      border: "1px solid var(--color-outline-variant)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
                        {aspirante?.nombre_aspi as string} {aspirante?.apellido_aspi as string}
                      </p>
                      <span className="text-[10px]" style={{ color: "var(--color-outline)" }}>
                        {new Date(app.created_at as string).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: "var(--color-on-surface-muted)" }}>
                      {app.cargo_postulacion as string}
                    </p>
                    <Link
                      to="/admin/applications"
                      className="block w-full text-center text-xs font-bold py-2 rounded-full transition-all"
                      style={{
                        background: "var(--color-surface-high)",
                        color: "var(--color-primary)",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "var(--color-primary)";
                        (e.currentTarget as HTMLElement).style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "var(--color-surface-high)";
                        (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                      }}
                    >
                      Revisar perfil
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link
              to="/admin/applications"
              className="block w-full mt-4 py-2.5 rounded-full text-sm font-bold text-center transition-colors border-2"
              style={{ color: "var(--color-primary)", borderColor: "rgba(0,103,125,0.2)" }}
            >
              Ver todas las postulaciones
            </Link>
          </section>

          {/* Recent Messages */}
          <section>
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-primary)" }}>
                forum
              </span>
              Mensajes
            </h3>
            <div className="space-y-3">
              {recentMsgs?.data?.length === 0 && (
                <p className="text-sm" style={{ color: "var(--color-outline)" }}>Sin mensajes</p>
              )}
              {recentMsgs?.data?.map((msg: Record<string, unknown>) => {
                const initials = (msg.nombre_mensaje as string)
                  .split(" ")
                  .slice(0, 2)
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase();
                return (
                  <div
                    key={msg.id_mensaje as number}
                    className="flex gap-3 items-start p-3 rounded-xl cursor-pointer transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-high)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: "var(--color-surface-highest)", color: "var(--color-on-surface-muted)" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
                        {msg.nombre_mensaje as string}
                        {!msg.leido && (
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ background: "var(--color-primary)" }}
                          />
                        )}
                      </p>
                      <p className="text-xs line-clamp-1" style={{ color: "var(--color-on-surface-muted)" }}>
                        {msg.asunto_mensaje as string}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              to="/admin/messages"
              className="block mt-3 text-sm font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todos los mensajes →
            </Link>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid var(--color-surface-high)" }}
      >
        <span
          className="font-extrabold text-lg"
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
        <p className="text-xs" style={{ color: "var(--color-outline)" }}>
          © 2024 PROLACE · Panel de Control v2.0
        </p>
      </footer>
    </div>
  );
}
