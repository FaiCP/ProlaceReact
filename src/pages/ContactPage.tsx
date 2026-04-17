import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api } from "../lib/api";

const schema = z.object({
  nombre_mensaje: z.string().min(1, "Requerido"),
  email_mensaje: z.string().email("Email inválido").optional().or(z.literal("")),
  asunto_mensaje: z.string().min(1, "Requerido"),
  cuerpo_mensaje: z.string().min(10, "Mínimo 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

const inputStyle = {
  background: "var(--color-surface-high)",
  color: "var(--color-on-surface)",
  border: "1.5px solid var(--color-outline-variant)",
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.post("/contact", data);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="pt-[72px] flex items-center justify-center min-h-[60vh] px-6">
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--color-secondary-bg)" }}
          >
            <span className="material-symbols-outlined text-3xl" style={{ color: "var(--color-secondary)" }}>
              check_circle
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
            Mensaje enviado
          </h1>
          <p style={{ color: "var(--color-on-surface-muted)" }}>
            Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <div
        className="px-6 pt-10 pb-8"
        style={{ background: "var(--color-surface-bright)" }}
      >
        <div className="max-w-xl mx-auto">
          <span
            className="text-xs font-bold uppercase tracking-widest mb-3 block"
            style={{ color: "var(--color-primary)" }}
          >
            PROLACE
          </span>
          <h1
            className="text-4xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--color-on-surface)" }}
          >
            Contacto
          </h1>
          <p style={{ color: "var(--color-on-surface-muted)" }}>
            Escríbenos y te responderemos a la brevedad.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl p-7 space-y-5 atmospheric-shadow"
          style={{ background: "var(--color-surface-bright)" }}
        >
          {[
            { label: "Nombre *", key: "nombre_mensaje" as const, type: "text", error: errors.nombre_mensaje?.message },
            { label: "Email", key: "email_mensaje" as const, type: "email", error: errors.email_mensaje?.message },
            { label: "Asunto *", key: "asunto_mensaje" as const, type: "text", error: errors.asunto_mensaje?.message },
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
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
              />
              {error && <p className="text-xs mt-1" style={{ color: "#ba1a1a" }}>{error}</p>}
            </div>
          ))}

          <div>
            <label
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-on-surface)" }}
            >
              Mensaje *
            </label>
            <textarea
              {...register("cuerpo_mensaje")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
            />
            {errors.cuerpo_mensaje && (
              <p className="text-xs mt-1" style={{ color: "#ba1a1a" }}>
                {errors.cuerpo_mensaje.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
          >
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </div>
  );
}
