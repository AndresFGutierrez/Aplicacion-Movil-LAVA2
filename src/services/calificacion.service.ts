import api, { ApiResponse } from './api';

export const calificacionService = {
  // Accept either positional arguments or a single object payload
  async calificarServicio(...args: any[]) {
    let reservacionId: string;
    let calificacionServicio: number;
    let comentarioServicio: string | undefined;
    let calificacionTrabajador: number | undefined;
    let comentarioTrabajador: string | undefined;

    if (args.length === 1 && typeof args[0] === 'object') {
      const p = args[0];
      reservacionId = p.reservacionId;
      calificacionServicio = p.calificacionServicio;
      comentarioServicio = p.comentarioServicio;
      calificacionTrabajador = p.calificacionTrabajador;
      comentarioTrabajador = p.comentarioTrabajador;
    } else {
      [reservacionId, calificacionServicio, comentarioServicio, calificacionTrabajador, comentarioTrabajador] = args;
    }

    const payload = {
      reservacionId,
      calificacionServicio,
      comentarioServicio,
      calificacionTrabajador,
      comentarioTrabajador,
    };

    const res = await api.post<ApiResponse<any>>('/api/calificaciones', payload);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error al crear calificación');
    return res.data.data;
  },

  async obtenerCalificaciones(trabajadorId: string) {
    const res = await api.get<ApiResponse<any>>(`/api/calificaciones/trabajador/${trabajadorId}`);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo calificaciones');
    return res.data.data;
  },
};

export const listarCalificacionesTrabajador = calificacionService.obtenerCalificaciones;
export const calificar = calificacionService.calificarServicio;

export default calificacionService;

export const crearCalificacion = calificacionService.calificarServicio;
