import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth";

const applySchema = z.object({
  cargo_postulacion: z.string().min(1, "Requerido"),
  lugar_postulacion: z.string().optional(),
  aniosExperiencia_postulacion: z.coerce.number().int().min(0).max(50).optional(),
  area_conocimiento: z.string().optional(),
});

type ApplyData = z.infer<typeof applySchema>;

const OPEN_POSITIONS = [
  { title: "Maestro Quesero", dept: "Producción", location: "Planta Central", type: "Tiempo Completo", urgent: true },
  { title: "Logística de Frescos", dept: "Logística", location: "Centro de Distribución", type: "Tiempo Completo", urgent: true },
  { title: "Ventas Regionales", dept: "Comercial", location: "Zona Norte", type: "Remoto Parcial", urgent: false },
  { title: "Analista de Microbiología", dept: "Calidad", location: "Laboratorio Central", type: "Plazo Fijo", urgent: false },
  { title: "Técnico en Refrigeración", dept: "Mantenimiento", location: "Planta 02", type: "Rotativo", urgent: false },
];

export default function JobsPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyData>({ resolver: zodResolver(applySchema) });

  const onSubmit = async (data: ApplyData) => {
    await api.post("/applications", data);
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 pt-12 pb-16 text-center"
        style={{ background: "linear-gradient(135deg, #00677d 0%, #00b4d8 100%)" }}
      >
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
          >
            Únete al equipo
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Cosecha tu Futuro<br />con Nosotros
          </h1>
          <p className="text-white/75 text-lg font-light leading-relaxed">
            Buscamos mentes creativas y manos expertas para llevar la pureza
            del campo a cada mesa.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Open positions */}
          <div>
            <h2
              className="text-2xl font-extrabold mb-6"
              style={{ color: "var(--color-on-surface)" }}
            >
              Vacantes abiertas
            </h2>
            <div className="space-y-4">
              {OPEN_POSITIONS.map((pos) => (
                <div
                  key={pos.title}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all"
                  style={{ background: "var(--color-surface-bright)", boxShadow: "0 4px 20px -4px rgba(25,28,29,0.06)" }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="font-bold text-base"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {pos.title}
                      </h4>
                      {pos.urgent && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(0,180,216,0.12)", color: "var(--color-primary)" }}
                        >
                          Urgente
                        </span>
                      )}
                    </div>
                    <div
                      className="flex flex-wrap gap-2 text-xs"
                      style={{ color: "var(--color-on-surface-muted)" }}
                    >
                      <span>{pos.dept}</span>
                      <span>•</span>
                      <span>{pos.location}</span>
                      <span>•</span>
                      <span>{pos.type}</span>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
                    style={{ background: "var(--color-secondary-bg)", color: "var(--color-secondary)" }}
                  >
                    Abierto
                  </span>
                </div>
              ))}
            </div>

            {/* Why join */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{ background: "var(--color-surface-high)" }}
            >
              <h3
                className="font-bold text-lg mb-5"
                style={{ color: "var(--color-on-surface)" }}
              >
                ¿Por qué trabajar aquí?
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "eco", bg: "var(--color-secondary-bg)", color: "var(--color-secondary)", text: "Cultura sostenible y valores de campo" },
                  { icon: "trending_up", bg: "var(--color-primary-bg)", color: "var(--color-primary)", text: "Crecimiento profesional y capacitación" },
                  { icon: "favorite", bg: "var(--color-tertiary-bg)", color: "var(--color-tertiary)", text: "Seguro de salud y beneficios integrales" },
                ].map(({ icon, bg, color, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl shrink-0" style={{ background: bg }}>
                      <span className="material-symbols-outlined" style={{ color, fontSize: "18px" }}>{icon}</span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Application form */}
          <div>
            <h2
              className="text-2xl font-extrabold mb-6"
              style={{ color: "var(--color-on-surface)" }}
            >
              Postula ahora
            </h2>

            {submitted ? (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: "var(--color-secondary-bg)" }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--color-secondary)" }}
                >
                  ¡Postulación enviada!
                </h3>
                <p className="text-sm" style={{ color: "var(--color-on-surface-muted)" }}>
                  Revisaremos tu perfil y te contactaremos pronto.
                </p>
              </div>
            ) : user?.role === "aspirante" ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl p-6 space-y-5 atmospheric-shadow"
                style={{ background: "var(--color-surface-bright)" }}
              >
                {[
                  {
                    label: "Cargo al que postula *",
                    key: "cargo_postulacion" as const,
                    type: "text",
                    error: errors.cargo_postulacion?.message,
                  },
                  {
                    label: "Ciudad / Lugar",
                    key: "lugar_postulacion" as const,
                    type: "text",
                    error: undefined,
                  },
                  {
                    label: "Años de experiencia",
                    key: "aniosExperiencia_postulacion" as const,
                    type: "number",
                    error: undefined,
                  },
                  {
                    label: "Área de conocimiento",
                    key: "area_conocimiento" as const,
                    type: "text",
                    error: undefined,
                  },
                ].map(({ label, key, type, error }) => (
                  <div key={key}>
                    <label
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      {label}
                    </label>
                    <input
                      {...register(key)}
                      type={type}
                      min={type === "number" ? 0 : undefined}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "var(--color-surface-high)",
                        color: "var(--color-on-surface)",
                        border: "1.5px solid var(--color-outline-variant)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
                    />
                    {error && (
                      <p className="text-xs mt-1" style={{ color: "#ba1a1a" }}>{error}</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar postulación"}
                </button>
              </form>
            ) : (
              <div
                className="rounded-2xl p-8 text-center atmospheric-shadow"
                style={{ background: "var(--color-surface-bright)" }}
              >
                <div className="text-5xl mb-5">👋</div>
                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{ color: "var(--color-on-surface-muted)" }}
                >
                  Debes registrarte como aspirante para postularte a nuestras vacantes.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/register-aspirante")}
                    className="w-full py-3.5 rounded-full font-bold text-white transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
                  >
                    Registrarme como aspirante
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 rounded-full font-semibold border-2 transition-all"
                    style={{
                      color: "var(--color-primary)",
                      borderColor: "var(--color-primary)",
                      background: "transparent",
                    }}
                  >
                    Ya tengo cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
