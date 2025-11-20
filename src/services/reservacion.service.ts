import api, { ApiResponse } from './api';

export interface Reservacion {
  id: string;
  usuarioId: string;
  servicioId: string;
  trabajadorId?: string | null;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  direccionServicio: string;
  estado: string;
  precioFinal: number;
}

export const reservacionService = {
  async crearReservacion(payload: {
    servicioId: string;
    trabajadorId?: string;
    fechaHoraInicio: string;
    direccionServicio: string;
    notasCliente?: string;
  }): Promise<Reservacion> {
    const res = await api.post<ApiResponse<Reservacion>>('/api/reservaciones', payload);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error creando reservación');
    return res.data.data as Reservacion;
  },

  async listarReservaciones(estado?: string, pagina = 1, limite = 20): Promise<{ reservaciones: Reservacion[]; meta?: any }> {
    const res = await api.get<ApiResponse<{ reservaciones: Reservacion[]; meta?: any }>>('/api/reservaciones', {
      params: { estado, pagina, limite },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error listando reservaciones');
    return res.data.data as { reservaciones: Reservacion[]; meta?: any };
  },

  async obtenerReservacion(id: string): Promise<Reservacion> {
    const res = await api.get<ApiResponse<Reservacion>>(`/api/reservaciones/${id}`);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo reservación');
    return res.data.data as Reservacion;
  },

  async cancelarReservacion(id: string): Promise<Reservacion> {
    const res = await api.patch<ApiResponse<Reservacion>>(`/api/reservaciones/${id}/cancelar`, {});
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error cancelando reservación');
    return res.data.data as Reservacion;
  },

  async obtenerHistorial(pagina = 1, limite = 20): Promise<{ reservaciones: Reservacion[]; meta?: any }> {
    const res = await api.get<ApiResponse<{ reservaciones: Reservacion[]; meta?: any }>>('/api/historial', {
      params: { pagina, limite },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo historial');
    return res.data.data as { reservaciones: Reservacion[]; meta?: any };
  },
};

// Named exports for compatibility with components
export const crearReservacion = reservacionService.crearReservacion;
export const listarReservacionesUsuario = reservacionService.listarReservaciones;
export const obtenerReservacionPorId = reservacionService.obtenerReservacion;
export const cancelarReservacion = reservacionService.cancelarReservacion;
export const obtenerHistorialReservacionesUsuario = reservacionService.obtenerHistorial;

export default reservacionService;
