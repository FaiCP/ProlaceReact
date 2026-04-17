import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { api, setCsrfToken } from "../lib/api";
import { useAuthStore } from "../store/auth";
import type { AuthUser } from "../store/auth";

const schema = z.object({
  identifier: z.string().min(1, "Requerido"),
  password: z.string().min(1, "Requerido"),
  role: z.enum(["usuario", "admin", "aspirante"]),
});

type FormData = z.infer<typeof schema>;

const inputStyle = {
  background: "var(--color-surface-high)",
  color: "var(--color-on-surface)",
  border: "1.5px solid var(--color-outline-variant)",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "usuario" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post<{ user: AuthUser; csrfToken: string }>("/auth/login", data);
      if (res.data.csrfToken) setCsrfToken(res.data.csrfToken);
      setUser(res.data.user);
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "aspirante") navigate("/applications");
      else navigate("/products");
    } catch {
      setError("root", { message: "Credenciales inválidas" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-headline)",
              background: "linear-gradient(135deg, #00677d, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PROLACE
          </Link>
          <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-muted)" }}>
            Portal de Comercio y Empleo
          </p>
        </div>

        <div
          className="rounded-2xl p-8 atmospheric-shadow"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <h1
            className="text-2xl font-extrabold mb-6"
            style={{ color: "var(--color-on-surface)" }}
          >
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--color-on-surface)" }}
              >
                Tipo de usuario
              </label>
              <select
                {...register("role")}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                <option value="usuario">Cliente</option>
                <option value="aspirante">Aspirante</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--color-on-surface)" }}
              >
                Email o usuario
              </label>
              <input
                {...register("identifier")}
                placeholder="tucorreo@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
              />
              {errors.identifier && (
                <p className="text-xs mt-1" style={{ color: "#ba1a1a" }}>{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "var(--color-on-surface)" }}
              >
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#ba1a1a" }}>{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: "#ffdad6", color: "#ba1a1a" }}
              >
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--color-on-surface-muted)" }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
