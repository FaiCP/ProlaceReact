import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { Product, PaginatedResponse } from "@prolace/types";

type ProductsResponse = PaginatedResponse<Product>;

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const { data: featuredProducts } = useQuery<ProductsResponse>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await api.get("/products?page=1&limit=4");
      return res.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <main className="pt-[72px]">
      {/* Hero */}
      <section
        className="hero-glow relative overflow-hidden pt-20 pb-16 px-6 text-center"
      >
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(0,180,216,0.07)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(0,103,125,0.05)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "var(--color-secondary-bg)",
              color: "var(--color-secondary)",
            }}
          >
            Comercio &amp; Empleo
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ color: "var(--color-on-surface)" }}
          >
            Productos frescos,{" "}
            <span style={{ color: "var(--color-primary)" }}>oportunidades reales</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
            style={{ color: "var(--color-on-surface-muted)" }}
          >
            Explora nuestro catálogo de lácteos artesanales o forma parte del equipo que
            lleva la pureza del campo a cada mesa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-3.5 rounded-full font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
            >
              Ver catálogo
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3.5 rounded-full font-bold border-2 transition-all"
              style={{
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                background: "transparent",
              }}
            >
              Ver vacantes
            </Link>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="px-6 pb-16 max-w-screen-xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="atmospheric-shadow rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-stretch"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <div className="flex-1 relative">
            <span
              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "var(--color-outline)" }}
            >
              search
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos (ej: queso, yogurt...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-full text-sm outline-none transition-all"
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
      </section>

      {/* Featured Products */}
      <section className="px-6 pb-20 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl md:text-3xl font-extrabold"
            style={{ color: "var(--color-on-surface)" }}
          >
            Productos destacados
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold flex items-center gap-1 transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            Ver todos <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {featuredProducts?.data && featuredProducts.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Big featured card */}
            <Link
              to={`/products/${featuredProducts.data[0].id_catalogo}`}
              className="sm:col-span-2 rounded-2xl overflow-hidden atmospheric-shadow group relative flex flex-col justify-end min-h-[280px]"
              style={{ background: "var(--color-surface-bright)" }}
            >
              {featuredProducts.data[0].ruta ? (
                <img
                  src={featuredProducts.data[0].ruta}
                  alt={featuredProducts.data[0].nombre_producto}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-7xl"
                  style={{ background: "var(--color-surface-high)" }}
                >
                  🧀
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
              />
              <div className="relative z-10 p-6">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block"
                  style={{ background: "var(--color-primary-dim)", color: "var(--color-primary)" }}
                >
                  {featuredProducts.data[0].tipo_producto || "Destacado"}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {featuredProducts.data[0].nombre_producto}
                </h3>
              </div>
            </Link>

            {/* Remaining product cards */}
            {featuredProducts.data.slice(1).map((product) => (
              <Link
                key={product.id_catalogo}
                to={`/products/${product.id_catalogo}`}
                className="rounded-2xl overflow-hidden atmospheric-shadow group"
                style={{ background: "var(--color-surface-bright)" }}
              >
                <div
                  className="h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--color-surface-high)" }}
                >
                  {product.ruta ? (
                    <img
                      src={product.ruta}
                      alt={product.nombre_producto}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-5xl">🥛</span>
                  )}
                </div>
                <div className="p-4">
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {product.tipo_producto}
                  </span>
                  <h3
                    className="font-semibold mt-1 group-hover:text-[#00677d] transition-colors"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {product.nombre_producto}
                  </h3>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "var(--color-surface-high)" }}
              >
                <div className="h-44" style={{ background: "var(--color-surface-highest)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded-full w-1/3" style={{ background: "var(--color-surface-highest)" }} />
                  <div className="h-4 rounded-full w-2/3" style={{ background: "var(--color-surface-highest)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Jobs CTA */}
      <section className="px-6 pb-20 max-w-screen-xl mx-auto">
        <div
          className="rounded-2xl p-10 md:p-14 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00677d 0%, #00b4d8 100%)" }}
        >
          <div
            className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 block">
                Únete al equipo
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Cosecha tu futuro<br />con nosotros
              </h2>
              <p className="text-white/80 max-w-md leading-relaxed">
                Buscamos mentes creativas y manos expertas para llevar la pureza del
                campo a cada mesa.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link
                to="/jobs"
                className="px-8 py-4 rounded-full font-bold text-center transition-all active:scale-95"
                style={{ background: "white", color: "var(--color-primary)" }}
              >
                Ver vacantes
              </Link>
              <Link
                to="/register-aspirante"
                className="px-8 py-4 rounded-full font-bold text-center border-2 border-white/50 text-white hover:bg-white/10 transition-all"
              >
                Registrarme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Prolace */}
      <section
        className="px-6 pb-20 max-w-screen-xl mx-auto"
      >
        <div
          className="rounded-2xl p-10 md:p-14"
          style={{ background: "var(--color-surface-high)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-8"
                style={{ color: "var(--color-on-surface)" }}
              >
                ¿Por qué elegir PROLACE?
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: "eco",
                    bg: "var(--color-secondary-bg)",
                    color: "var(--color-secondary)",
                    title: "Cultura Sostenible",
                    desc: "Respetamos el ciclo natural de la tierra y valoramos el bienestar de nuestros productores.",
                  },
                  {
                    icon: "trending_up",
                    bg: "var(--color-primary-bg)",
                    color: "var(--color-primary)",
                    title: "Crecimiento Vital",
                    desc: "Programas de capacitación técnica y liderazgo para que evoluciones con nosotros.",
                  },
                  {
                    icon: "favorite",
                    bg: "var(--color-tertiary-bg)",
                    color: "var(--color-tertiary)",
                    title: "Bienestar Integral",
                    desc: "Seguro de salud, bonos de alimentación y productos lácteos mensuales.",
                  },
                ].map(({ icon, bg, color, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div
                      className="p-3 rounded-xl h-fit shrink-0"
                      style={{ background: bg }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color }}
                      >
                        {icon}
                      </span>
                    </div>
                    <div>
                      <h5
                        className="font-bold text-lg mb-1"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {title}
                      </h5>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-muted)" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-2xl overflow-hidden atmospheric-shadow min-h-[320px] flex items-center justify-center"
              style={{ background: "var(--color-surface-highest)" }}
            >
              <div className="text-center p-10">
                <div className="text-8xl mb-4">🐄</div>
                <p
                  className="font-semibold text-lg"
                  style={{ color: "var(--color-on-surface-muted)" }}
                >
                  Del campo a tu mesa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-12 mt-4"
        style={{
          background: "var(--color-surface-high)",
          borderTop: "1px solid var(--color-outline-variant)",
        }}
      >
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span
              className="text-xl font-extrabold block mb-1"
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
            <p className="text-sm" style={{ color: "var(--color-outline)" }}>
              © 2024 PROLACE. Portal de Comercio y Empleo.
            </p>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: "var(--color-outline)" }}>
            <Link to="/products" className="hover:text-[#00677d] transition-colors">Catálogo</Link>
            <Link to="/jobs" className="hover:text-[#00677d] transition-colors">Vacantes</Link>
            <Link to="/contact" className="hover:text-[#00677d] transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
