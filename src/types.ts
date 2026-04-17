// ============================================================
//  @prolace/types — Tipos compartidos entre API y frontend
// ============================================================

// ------ Auth -----------------------------------------------

export type UserRole = "admin" | "usuario" | "aspirante";

export interface AuthUser {
  id: string;
  role: UserRole;
  displayName?: string;
  email?: string;
}

// ------ Paginación -----------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SingleResponse<T> {
  data: T;
}

// ------ Enums ----------------------------------------------

export type EstadoPedido = "Pendiente" | "Despachado" | "Entregado" | "Cancelado";

export type EstadoPostulacion = "Pendiente" | "En_revision" | "Aceptado" | "Rechazado";

// ------ Producto -------------------------------------------

export interface Product {
  id_catalogo: number;
  nombre_producto: string;
  tipo_producto: string;
  descripcion_producto: string | null;
  nombre_imagen: string | null;
  ruta: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductBody {
  nombre_producto: string;
  tipo_producto: string;
  descripcion_producto?: string;
  nombre_imagen?: string;
  ruta?: string;
  activo?: boolean;
}

// ------ Usuario --------------------------------------------

export interface Usuario {
  id_usuario: number;
  user: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: number;
  activo: boolean;
  created_at: string;
}

export interface CreateUsuarioBody {
  user: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: number;
}

// ------ Pedido ---------------------------------------------

export interface Order {
  id_pedidos: number;
  id_usuario: number;
  tipoProducto_pedido: string;
  cantidad_pedido: number;
  fechaRealizacion_pedido: string;
  fechaEntrega_pedido: string | null;
  EstadoEntrega_pedido: EstadoPedido;
  created_at: string;
  updated_at: string;
}

export interface OrderWithUsuario extends Order {
  usuario: Pick<Usuario, "id_usuario" | "user" | "nombre" | "apellido">;
}

export interface CreateOrderBody {
  tipoProducto_pedido: string;
  cantidad_pedido: number;
  fechaRealizacion_pedido: string;
  fechaEntrega_pedido?: string;
}

// ------ Aspirante ------------------------------------------

export interface Aspirante {
  id_aspirante: number;
  nombre_aspi: string;
  apellido_aspi: string;
  ciudad: string | null;
  email_aspi: string;
  telefono_aspi: string | null;
  activo: boolean;
  created_at: string;
}

export interface RegisterAspiranteBody {
  nombre_aspi: string;
  apellido_aspi: string;
  ciudad?: string;
  email_aspi: string;
  telefono_aspi?: string;
  password: string;
}

// ------ Postulación ----------------------------------------

export interface Application {
  id_postulacion: number;
  id_aspirante: number;
  cargo_postulacion: string;
  lugar_postulacion: string | null;
  aniosExperiencia_postulacion: number | null;
  area_conocimiento: string | null;
  estado_postulacion: EstadoPostulacion;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithAspirante extends Application {
  aspirante: Pick<Aspirante, "id_aspirante" | "nombre_aspi" | "apellido_aspi" | "email_aspi">;
}

export interface CreateApplicationBody {
  cargo_postulacion: string;
  lugar_postulacion?: string;
  aniosExperiencia_postulacion?: number;
  area_conocimiento?: string;
}

// ------ Mensaje --------------------------------------------

export interface Message {
  id_mensaje: number;
  nombre_mensaje: string;
  email_mensaje: string | null;
  asunto_mensaje: string;
  cuerpo_mensaje: string | null;
  leido: boolean;
  fechaDepeticion: string;
}

export interface CreateMessageBody {
  nombre_mensaje: string;
  email_mensaje?: string;
  asunto_mensaje: string;
  cuerpo_mensaje?: string;
}
