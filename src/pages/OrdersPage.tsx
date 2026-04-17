import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Order, PaginatedResponse } from "../types";

const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  Despachado: "bg-blue-100 text-blue-800",
  Entregado: "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800"
};

export default function OrdersPage() {
  const { data, isLoading } = useQuery<PaginatedResponse<Order>>({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders").then((r) => r.data)
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No tienes pedidos aún.</p>
          <a href="/products" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Ver catálogo</a>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data.map((order) => (
            <div key={order.id_pedidos} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-gray-900">{order.tipoProducto_pedido}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Cantidad: <span className="font-medium text-gray-700">{order.cantidad_pedido}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Fecha: {new Date(order.fechaRealizacion_pedido).toLocaleDateString("es-CO")}
                  </p>
                  {order.fechaEntrega_pedido && (
                    <p className="text-sm text-gray-500">
                      Entrega: {new Date(order.fechaEntrega_pedido).toLocaleDateString("es-CO")}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.EstadoEntrega_pedido] ?? "bg-gray-100 text-gray-700"}`}>
                  {order.EstadoEntrega_pedido}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
