import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Message, PaginatedResponse } from "../../types";

export default function AdminMessages() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<Message>>({
    queryKey: ["admin-messages"],
    queryFn: () => api.get("/admin/messages?limit=100").then(r => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
          Mensajes
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
          Solicitudes de contacto recibidas
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16" style={{ color: "var(--color-outline)" }}>
          <span className="material-symbols-outlined text-4xl">progress_activity</span>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--color-surface-high)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--color-outline)" }}>
              forum
            </span>
          </div>
          <p className="font-semibold" style={{ color: "var(--color-on-surface-muted)" }}>
            No hay mensajes
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((msg) => {
            const initials = msg.nombre_mensaje
              .split(" ")
              .slice(0, 2)
              .map(w => w[0])
              .join("")
              .toUpperCase();
            return (
              <div
                key={msg.id_mensaje}
                className="rounded-2xl p-5 atmospheric-shadow transition-all"
                style={{
                  background: "var(--color-surface-bright)",
                  borderLeft: msg.leido
                    ? "4px solid var(--color-surface-high)"
                    : "4px solid var(--color-primary)",
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: msg.leido ? "var(--color-surface-high)" : "var(--color-primary-bg)",
                      color: msg.leido ? "var(--color-on-surface-muted)" : "var(--color-primary)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: "var(--color-on-surface)" }}>
                          {msg.nombre_mensaje}
                        </span>
                        {!msg.leido && (
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                            style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}
                          >
                            Nuevo
                          </span>
                        )}
                        {msg.email_mensaje && (
                          <span className="text-sm" style={{ color: "var(--color-outline)" }}>
                            — {msg.email_mensaje}
                          </span>
                        )}
                      </div>
                      <span className="text-xs shrink-0" style={{ color: "var(--color-outline)" }}>
                        {new Date(msg.fechaDepeticion).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-on-surface)" }}>
                      {msg.asunto_mensaje}
                    </p>
                    {msg.cuerpo_mensaje && (
                      <p className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                        {msg.cuerpo_mensaje}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3">
                      {!msg.leido && (
                        <button
                          onClick={() => markRead.mutate(msg.id_mensaje)}
                          className="text-xs font-semibold flex items-center gap-1 transition-colors"
                          style={{ color: "var(--color-primary)" }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>mark_email_read</span>
                          Marcar como leído
                        </button>
                      )}
                      <button
                        onClick={() => remove.mutate(msg.id_mensaje)}
                        className="text-xs font-semibold flex items-center gap-1 transition-colors"
                        style={{ color: "#ba1a1a" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>delete</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
