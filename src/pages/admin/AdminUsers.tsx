import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Usuario, PaginatedResponse } from "@prolace/types";

const ROLE_LABELS: Record<number, string> = { 1: "Cliente", 2: "Admin", 3: "Aspirante" };

export default function AdminUsers() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<Usuario>>({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users?limit=100").then(r => r.data),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      api.patch(`/admin/users/${id}`, { activo }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const getRoleStyle = (rol: number) => {
    if (rol === 2) return { bg: "#ede9fe", color: "#7c3aed" };
    if (rol === 3) return { bg: "#fef3c7", color: "#92400e" };
    return { bg: "var(--color-surface-high)", color: "var(--color-on-surface-muted)" };
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
          Usuarios
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
          Gestión de cuentas registradas
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16" style={{ color: "var(--color-outline)" }}>
          <span className="material-symbols-outlined text-4xl">progress_activity</span>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden atmospheric-shadow"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-surface-low)" }}>
                  {["Usuario", "Nombre", "Email", "Rol", "Estado", "Registro", ""].map(h => (
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
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12" style={{ color: "var(--color-outline)" }}>
                      No hay usuarios
                    </td>
                  </tr>
                )}
                {data?.data.map((u) => {
                  const roleStyle = getRoleStyle(u.rol);
                  return (
                    <tr
                      key={u.id_usuario}
                      className="transition-colors"
                      style={{ borderTop: "1px solid var(--color-surface-high)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-low)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #00677d, #00b4d8)",
                              color: "#fff",
                            }}
                          >
                            {(u.nombre?.[0] ?? u.user?.[0] ?? "?").toUpperCase()}
                          </div>
                          <span className="font-medium" style={{ color: "var(--color-on-surface)" }}>
                            @{u.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-on-surface)" }}>
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                        {u.email}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                          style={{ background: roleStyle.bg, color: roleStyle.color }}
                        >
                          {ROLE_LABELS[u.rol] ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                          style={
                            u.activo
                              ? { background: "var(--color-secondary-bg)", color: "var(--color-secondary)" }
                              : { background: "#ffdad6", color: "#ba1a1a" }
                          }
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-outline)" }}>
                        {new Date(u.created_at).toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleActive.mutate({ id: u.id_usuario, activo: !u.activo })}
                          className="text-xs font-semibold transition-colors"
                          style={{ color: u.activo ? "#ba1a1a" : "var(--color-secondary)" }}
                        >
                          {u.activo ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
