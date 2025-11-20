import api, { ApiResponse } from './api';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  datos?: any;
}

export const notificacionService = {
  async obtenerNotificaciones(pagina = 1, limite = 20) {
    const res = await api.get<ApiResponse<{ notificaciones: Notificacion[]; meta?: any }>>('/api/notificaciones', {
      params: { pagina, limite },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error listando notificaciones');
    return res.data.data;
  },

  async marcarComoLeida(id: string) {
    const res = await api.patch<ApiResponse<Notificacion>>(`/api/notificaciones/${id}/leer`, {});
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error marcando notificación como leída');
    return res.data.data;
  },

  async marcarTodasLeidas() {
    const res = await api.post<ApiResponse<null>>('/api/notificaciones/marcar-todas-leidas', {});
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error marcando todas como leídas');
  },

  async obtenerNoLeidas() {
    const res = await api.get<ApiResponse<Notificacion[]>>('/api/notificaciones/no-leidas');
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo no leídas');
    return res.data.data as Notificacion[];
  },
};

export const listarNotificacionesUsuario = notificacionService.obtenerNotificaciones;
export const obtenerNotificacionPorId = (id: string) => notificacionService.obtenerNotificaciones(1, 20).then((data: any) => {
  // Nota: endpoint específico para obtener por id no implementado en service; intentar filtrar
  const items = (data?.notificaciones) || [];
  return items.find((n: any) => n.id === id) || null;
});

export default notificacionService;
