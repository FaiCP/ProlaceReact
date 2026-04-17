import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { OrderWithUsuario, PaginatedResponse } from "../../types";

const ESTADOS = ["Pendiente", "Despachado", "Entregado", "Cancelado"];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Pendiente:  { bg: "#fef3c7", color: "#92400e" },
  Despachado: { bg: "var(--color-primary-bg)", color: "var(--color-primary)" },
  Entregado:  { bg: "var(--color-secondary-bg)", color: "var(--color-secondary)" },
  Cancelado:  { bg: "#ffdad6", color: "#ba1a1a" },
};

export default function AdminOrders() {
  const qc = useQueryClient();
  const [estado, setEstado] = useState("");

  const { data, isLoading } = useQuery<PaginatedResponse<OrderWithUsuario>>({
    queryKey: ["admin-orders", estado],
    queryFn: () => {
      const params = new URLSearchParams({ limit: "50" });
      if (estado) params.set("estado", estado);
      return api.get(`/orders?${params}`).then(r => r.data);
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/orders/${id}/status`, { EstadoEntrega_pedido: status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Pedidos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
            Gestión y seguimiento de pedidos
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
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
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
                  {["#", "Cliente", "Producto", "Cant.", "Fecha", "Estado"].map(h => (
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
                    <td colSpan={6} className="text-center py-12" style={{ color: "var(--color-outline)" }}>
                      No hay pedidos
                    </td>
                  </tr>
                )}
                {data?.data.map((order) => {
                  const style = STATUS_STYLE[order.EstadoEntrega_pedido] ?? { bg: "var(--color-surface-high)", color: "var(--color-outline)" };
                  return (
                    <tr
                      key={order.id_pedidos}
                      className="transition-colors"
                      style={{ borderTop: "1px solid var(--color-surface-high)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-low)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}
                    >
                      <td className="px-5 py-4 font-bold" style={{ color: "var(--color-primary)" }}>
                        #{order.id_pedidos}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium" style={{ color: "var(--color-on-surface)" }}>
                          {order.usuario.nombre} {order.usuario.apellido}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-outline)" }}>
                          @{order.usuario.user}
                        </p>
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                        {order.tipoProducto_pedido}
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                        {order.cantidad_pedido}
                      </td>
                      <td className="px-5 py-4" style={{ color: "var(--color-outline)" }}>
                        {new Date(order.fechaRealizacion_pedido).toLocaleDateString("es-CO")}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.EstadoEntrega_pedido}
                          onChange={(e) => updateStatus.mutate({ id: order.id_pedidos, status: e.target.value })}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
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
