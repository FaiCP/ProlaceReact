import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Application } from "../types";

const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  En_revision: "bg-blue-100 text-blue-800",
  Aceptado: "bg-green-100 text-green-800",
  Rechazado: "bg-red-100 text-red-800"
};

const STATUS_LABELS: Record<string, string> = {
  Pendiente: "Pendiente",
  En_revision: "En revisión",
  Aceptado: "Aceptado",
  Rechazado: "Rechazado"
};

export default function ApplicationsPage() {
  const { data, isLoading } = useQuery<{ data: Application[] }>({
    queryKey: ["my-applications"],
    queryFn: () => api.get("/applications").then((r) => r.data)
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Postulaciones</h1>
        <Link
          to="/jobs"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Nueva postulación
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No tienes postulaciones aún.</p>
          <Link to="/jobs" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Postularme ahora
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((app) => (
            <div key={app.id_postulacion} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-gray-900">{app.cargo_postulacion}</h2>
                  {app.lugar_postulacion && (
                    <p className="text-sm text-gray-500 mt-1">📍 {app.lugar_postulacion}</p>
                  )}
                  {app.area_conocimiento && (
                    <p className="text-sm text-gray-500">🎓 {app.area_conocimiento}</p>
                  )}
                  {app.aniosExperiencia_postulacion != null && (
                    <p className="text-sm text-gray-500">💼 {app.aniosExperiencia_postulacion} años de experiencia</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(app.created_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[app.estado_postulacion] ?? "bg-gray-100 text-gray-700"}`}>
                  {STATUS_LABELS[app.estado_postulacion] ?? app.estado_postulacion}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
