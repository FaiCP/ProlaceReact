import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { ApplicationWithAspirante, PaginatedResponse } from "../../types";

const ESTADOS = ["Pendiente", "En_revision", "Aceptado", "Rechazado"];
const LABELS: Record<string, string> = {
  Pendiente: "Pendiente",
  En_revision: "En revisión",
  Aceptado: "Aceptado",
  Rechazado: "Rechazado",
};
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Pendiente:   { bg: "#fef3c7", color: "#92400e" },
  En_revision: { bg: "var(--color-primary-bg)", color: "var(--color-primary)" },
  Aceptado:    { bg: "var(--color-secondary-bg)", color: "var(--color-secondary)" },
  Rechazado:   { bg: "#ffdad6", color: "#ba1a1a" },
};

export default function AdminApplications() {
  const qc = useQueryClient();
  const [estado, setEstado] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<ApplicationWithAspirante>>({
    queryKey: ["admin-applications", estado],
    queryFn: () => {
      const params = new URLSearchParams({ limit: "50" });
      if (estado) params.set("estado", estado);
      return api.get(`/admin/applications?${params}`).then(r => r.data);
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/admin/applications/${id}/status`, { estado_postulacion: status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-applications"] }),
  });

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Postulaciones
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
            Candidatos registrados para vacantes
          </p>
        </div>
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ fontSize: "18px", color: "var(--color-outline)" }}
          >
            filter_list
          </span>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-full text-sm font-semibold outline-none"
            style={{
              background: "var(--color-surface-bright)",
              color: "var(--color-on-surface)",
              border: "1.5px solid var(--color-outline-variant)",
            }}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{LABELS[e]}</option>)}
          </select>
        </div>
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
              person_search
            </span>
          </div>
          <p className="font-semibold" style={{ color: "var(--color-on-surface-muted)" }}>
            No hay postulaciones
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((app) => {
            const statusStyle = STATUS_STYLE[app.estado_postulacion] ?? { bg: "var(--color-surface-high)", color: "var(--color-outline)" };
            const initials = `${app.aspirante.nombre_aspi?.[0] ?? ""}${app.aspirante.apellido_aspi?.[0] ?? ""}`.toUpperCase();
            return (
              <div
                key={app.id_postulacion}
                className="rounded-2xl p-5 atmospheric-shadow transition-all"
                style={{ background: "var(--color-surface-bright)" }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-base" style={{ color: "var(--color-on-surface)" }}>
                          {app.aspirante.nombre_aspi} {app.aspirante.apellido_aspi}
                        </h2>
                        <p className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                          {app.aspirante.email_aspi}
                        </p>
                      </div>
                      <select
                        value={app.estado_postulacion}
                        onChange={(e) => updateStatus.mutate({ id: app.id_postulacion, status: e.target.value })}
                        className="text-xs font-bold px-4 py-2 rounded-full border-0 cursor-pointer outline-none shrink-0"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {ESTADOS.map(e => <option key={e} value={e}>{LABELS[e]}</option>)}
                      </select>
                    </div>

                    <div
                      className="mt-3 pt-3 flex flex-wrap gap-4"
                      style={{ borderTop: "1px solid var(--color-surface-high)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-primary)" }}>
                          work
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                          {app.cargo_postulacion}
                        </span>
                      </div>
                      {app.lugar_postulacion && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-outline)" }}>
                            location_on
                          </span>
                          <span className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                            {app.lugar_postulacion}
                          </span>
                        </div>
                      )}
                      {app.area_conocimiento && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-outline)" }}>
                            school
                          </span>
                          <span className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                            {app.area_conocimiento}
                          </span>
                        </div>
                      )}
                      {app.aniosExperiencia_postulacion != null && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-outline)" }}>
                            history_edu
                          </span>
                          <span className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                            {app.aniosExperiencia_postulacion} años exp.
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-outline)" }}>
                          schedule
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                          {new Date(app.created_at).toLocaleDateString("es-CO")}
                        </span>
                      </div>
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
