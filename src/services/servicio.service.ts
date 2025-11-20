import api, { ApiResponse } from './api';

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  imagenUrl?: string | null;
  activo: boolean;
}

export const servicioService = {
  async listarServicios(pagina = 1, limite = 50): Promise<{ servicios: Servicio[]; meta?: any }> {
    const res = await api.get<ApiResponse<{ servicios: Servicio[]; meta?: any }>>('/api/servicios', {
      params: { pagina, limite },
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error listando servicios');
    return res.data.data as { servicios: Servicio[]; meta?: any };
  },

  async obtenerServicio(id: string): Promise<Servicio> {
    const res = await api.get<ApiResponse<Servicio>>(`/api/servicios/${id}`);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo servicio');
    return res.data.data as Servicio;
  },
};

export const listarServicios = servicioService.listarServicios;
export const obtenerServicioPorId = servicioService.obtenerServicio;

export default servicioService;
