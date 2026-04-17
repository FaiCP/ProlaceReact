import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";

interface Product {
  id_catalogo: number;
  nombre_producto: string;
  tipo_producto: string;
  descripcion_producto: string | null;
  ruta: string | null;
  activo: boolean;
}

const schema = z.object({
  nombre_producto: z.string().min(1),
  tipo_producto: z.string().min(1),
  descripcion_producto: z.string().optional(),
  ruta: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all";
const inputStyle = {
  background: "var(--color-surface-low)",
  color: "var(--color-on-surface)",
  border: "1.5px solid var(--color-outline-variant)",
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/products?limit=100&activo=all").then(r => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const save = useMutation({
    mutationFn: (d: FormData) =>
      editing
        ? api.put(`/products/${editing.id_catalogo}`, d)
        : api.post("/products", d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      reset();
      setShowForm(false);
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const openEdit = (p: Product) => {
    setEditing(p);
    reset({
      nombre_producto: p.nombre_producto,
      tipo_producto: p.tipo_producto,
      descripcion_producto: p.descripcion_producto ?? "",
      ruta: p.ruta ?? "",
    });
    setShowForm(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Productos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-muted)" }}>
            Gestión del catálogo de lácteos
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); reset({}); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Nuevo producto
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-8 atmospheric-shadow"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <h2 className="font-bold text-lg mb-5" style={{ color: "var(--color-on-surface)" }}>
            {editing ? "Editar producto" : "Nuevo producto"}
          </h2>
          <form onSubmit={handleSubmit((d) => save.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-on-surface)" }}>
                  Nombre *
                </label>
                <input
                  {...register("nombre_producto")}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-on-surface)" }}>
                  Tipo *
                </label>
                <input
                  {...register("tipo_producto")}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-on-surface)" }}>
                Descripción
              </label>
              <textarea
                {...register("descripcion_producto")}
                rows={3}
                className={`${inputCls} resize-none`}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-on-surface)" }}>
                URL de imagen
              </label>
              <input
                {...register("ruta")}
                placeholder="https://..."
                className={inputCls}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--color-outline-variant)")}
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #00677d, #00b4d8)" }}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-6 py-2.5 rounded-full font-semibold border-2 transition-all"
                style={{ color: "var(--color-on-surface-muted)", borderColor: "var(--color-outline-variant)" }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-16" style={{ color: "var(--color-outline)" }}>
          <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden atmospheric-shadow"
          style={{ background: "var(--color-surface-bright)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-surface-low)" }}>
                {["Producto", "Tipo", "Estado", ""].map(h => (
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
              {data?.data.map((p) => (
                <tr
                  key={p.id_catalogo}
                  className="transition-colors"
                  style={{ borderTop: "1px solid var(--color-surface-high)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-low)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <td className="px-5 py-4 font-semibold" style={{ color: "var(--color-on-surface)" }}>
                    <div className="flex items-center gap-3">
                      {p.ruta ? (
                        <img src={p.ruta} alt={p.nombre_producto} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: "var(--color-surface-high)" }}
                        >
                          🧀
                        </div>
                      )}
                      {p.nombre_producto}
                    </div>
                  </td>
                  <td className="px-5 py-4" style={{ color: "var(--color-on-surface-muted)" }}>
                    {p.tipo_producto}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                      style={
                        p.activo
                          ? { background: "var(--color-secondary-bg)", color: "var(--color-secondary)" }
                          : { background: "var(--color-surface-high)", color: "var(--color-outline)" }
                      }
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-semibold mr-4 transition-colors"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => remove.mutate(p.id_catalogo)}
                      className="text-xs font-semibold transition-colors"
                      style={{ color: "#ba1a1a" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
