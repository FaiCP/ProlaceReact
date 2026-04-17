import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

const schema = z.object({
  nombre_aspi: z.string().min(1, "Requerido"),
  apellido_aspi: z.string().min(1, "Requerido"),
  ciudad: z.string().optional(),
  email_aspi: z.string().email("Email inválido"),
  telefono_aspi: z.string().optional(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type FormData = z.infer<typeof schema>;

export default function RegisterAspirantePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/aspirantes/register", data);
      navigate("/login");
    } catch (err: any) {
      setError("root", { message: err.response?.data?.message ?? "Error al registrar" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro de Aspirante</h1>
        <p className="text-sm text-gray-500 mb-6">Crea tu cuenta para postularte a nuestras vacantes.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "nombre_aspi" as const, label: "Nombre" },
            { name: "apellido_aspi" as const, label: "Apellido" },
            { name: "ciudad" as const, label: "Ciudad" },
            { name: "email_aspi" as const, label: "Email", type: "email" },
            { name: "telefono_aspi" as const, label: "Teléfono" },
            { name: "password" as const, label: "Contraseña", type: "password" },
            { name: "confirmPassword" as const, label: "Confirmar contraseña", type: "password" }
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                {...register(name)}
                type={type}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
            </div>
          ))}

          {errors.root && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
