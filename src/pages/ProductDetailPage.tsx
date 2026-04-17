import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth";
import type { Product, SingleResponse } from "../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);

  const { data, isLoading } = useQuery<SingleResponse<Product>>({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data)
  });

  const order = useMutation({
    mutationFn: () =>
      api.post("/orders", {
        tipoProducto_pedido: data!.data.nombre_producto,
        cantidad_pedido: quantity,
        fechaRealizacion_pedido: new Date().toISOString().split("T")[0]
      }),
    onSuccess: () => setOrdered(true)
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl mb-6" />
          <div className="h-8 bg-gray-200 rounded mb-4 w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!data) return null;
  const product = data.data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Volver al catálogo
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 h-72 flex items-center justify-center">
          {product.ruta ? (
            <img src={product.ruta} alt={product.nombre_producto} className="h-full w-full object-cover" />
          ) : (
            <span className="text-7xl">🧀</span>
          )}
        </div>

        <div className="p-8">
          <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">{product.tipo_producto}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.nombre_producto}</h1>
          {product.descripcion_producto && (
            <p className="text-gray-600 mt-4 leading-relaxed">{product.descripcion_producto}</p>
          )}

          {user?.role === "usuario" && (
            <div className="mt-8 flex items-center gap-4">
              {ordered ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-6 py-3">
                  ✓ Pedido realizado exitosamente
                </div>
              ) : (
                <>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >−</button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >+</button>
                  </div>
                  <button
                    onClick={() => order.mutate()}
                    disabled={order.isPending}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {order.isPending ? "Procesando..." : "Realizar pedido"}
                  </button>
                </>
              )}
            </div>
          )}

          {!user && (
            <p className="mt-8 text-sm text-gray-500">
              <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a> para realizar un pedido.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
