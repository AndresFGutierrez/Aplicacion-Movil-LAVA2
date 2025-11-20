import api, { ApiResponse } from './api';

export interface Trabajador {
  id: string;
  nombreCompleto: string;
  telefono?: string;
  fotoPerfil?: string | null;
  calificacionPromedio?: number | null;
  activo: boolean;
}

export const trabajadorService = {
  async listarTrabajadores(pagina = 1, limite = 20): Promise<{ trabajadores: Trabajador[]; meta?: any }> {
    const res = await api.get<ApiResponse<{ trabajadores: Trabajador[]; meta?: any }>>('/api/trabajadores', {
      params: { pagina, limite },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error listando trabajadores');
    return res.data.data as { trabajadores: Trabajador[]; meta?: any };
  },

  async obtenerTrabajador(id: string): Promise<Trabajador> {
    const res = await api.get<ApiResponse<Trabajador>>(`/api/trabajadores/${id}`);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo trabajador');
    return res.data.data as Trabajador;
  },

  async obtenerDisponibles(fechaIso: string, servicioId?: string): Promise<Trabajador[]> {
    const res = await api.get<ApiResponse<Trabajador[]>>('/api/trabajadores/disponibles', {
      params: { fecha: fechaIso, servicioId },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo trabajadores disponibles');
    return res.data.data as Trabajador[];
  },

  async obtenerHorarios(trabajadorId: string, fechaIso?: string): Promise<any> {
    const res = await api.get<ApiResponse<any>>(`/api/trabajadores/${trabajadorId}/horarios`, {
      params: { fecha: fechaIso },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo horarios');
    return res.data.data;
  },
};

// Named exports for convenience (used by components)
export const listarTrabajadores = trabajadorService.listarTrabajadores;
export const obtenerTrabajadorPorId = trabajadorService.obtenerTrabajador;
export const obtenerTrabajadoresDisponibles = trabajadorService.obtenerDisponibles;
export const obtenerHorariosTrabajador = trabajadorService.obtenerHorarios;

export default trabajadorService;
