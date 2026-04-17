import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Product, PaginatedResponse } from "../types";

type ProductsResponse = PaginatedResponse<Product>;

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [tipo, setTipo] = useState("");
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearch(q);
      setInputValue(q);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products", page, search, tipo],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (search) params.set("q", search);
      if (tipo) params.set("tipo", tipo);
      const res = await api.get(`/products?${params}`);
      return res.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue);
    setPage(1);
  };

  return (
    <div className="pt-[72px]">
      {/* Page header */}
      <div
        className="px-6 pt-10 pb-8"
        style={{ background: "var(--color-surface-bright)" }}
      >
        <div className="max-w-screen-xl mx-auto">
          <span
            className="text-xs font-bold uppercase tracking-widest mb-3 block"
            style={{ color: "var(--color-primary)" }}
          >
            PROLACE
          </span>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--color-on-surface)" }}
          >
            Catálogo de Productos
          </h1>
          <p className="text-base" style={{ color: "var(--color-on-surface-muted)" }}>
            Lácteos artesanales frescos, directo del campo.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Search & filter */}
        <form
          onSubmit={handleSearch}
          className="atmospheric-shadow rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-stretch mb-10"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <div className="flex-1 relative">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-outline)", fontSize: "20px" }}
            >
              search
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar productos (ej: queso, yogurt...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-full text-sm outline-none transition-all"
              style={{
                background: "var(--color-surface-high)",
                color: "var(--color-on-surface)",
                border: "none",
              }}
            />
          </div>
          <div className="relative min-w-[180px]">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-outline)", fontSize: "20px" }}
            >
              category
            </span>
            <input
              value={tipo}
              onChange={(e) => { setTipo(e.target.value); setPage(1); }}
              placeholder="Tipo de producto"
              className="w-full pl-12 pr-4 py-3.5 rounded-full text-sm outline-none"
              style={{
                background: "var(--color-surface-high)",
                color: "var(--color-on-surface)",
                border: "none",
              }}
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full font-bold text-white transition-all active:scale-95 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
          >
            Buscar
          </button>
        </form>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "var(--color-surface-bright)" }}
              >
                <div className="h-48" style={{ background: "var(--color-surface-high)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded-full w-1/3" style={{ background: "var(--color-surface-highest)" }} />
                  <div className="h-4 rounded-full w-2/3" style={{ background: "var(--color-surface-highest)" }} />
                  <div className="h-3 rounded-full w-full" style={{ background: "var(--color-surface-highest)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold" style={{ color: "var(--color-on-surface)" }}>
              No se encontraron productos
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-muted)" }}>
              Intenta con otro término de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.data.map((product) => (
              <Link
                key={product.id_catalogo}
                to={`/products/${product.id_catalogo}`}
                className="rounded-2xl overflow-hidden atmospheric-shadow group transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--color-surface-bright)" }}
              >
                <div
                  className="h-48 flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--color-surface-high)" }}
                >
                  {product.ruta ? (
                    <img
                      src={product.ruta}
                      alt={product.nombre_producto}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-5xl">🧀</span>
                  )}
                </div>
                <div className="p-4">
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {product.tipo_producto}
                  </span>
                  <h2
                    className="font-semibold mt-1 transition-colors"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {product.nombre_producto}
                  </h2>
                  {product.descripcion_producto && (
                    <p
                      className="text-sm mt-1 line-clamp-2"
                      style={{ color: "var(--color-on-surface-muted)" }}
                    >
                      {product.descripcion_producto}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.meta.pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all disabled:opacity-40"
              style={{
                color: "var(--color-on-surface-muted)",
                borderColor: "var(--color-outline-variant)",
                background: "var(--color-surface-bright)",
              }}
            >
              ← Anterior
            </button>
            <span className="px-4 py-2 text-sm" style={{ color: "var(--color-outline)" }}>
              {page} / {data.meta.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.meta.pages, p + 1))}
              disabled={page === data.meta.pages}
              className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all disabled:opacity-40"
              style={{
                color: "var(--color-on-surface-muted)",
                borderColor: "var(--color-outline-variant)",
                background: "var(--color-surface-bright)",
              }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
