import api, { ApiResponse } from './api';

export interface MetodoPago {
  id: string;
  tipo: string;
  ultimos4Digitos?: string | null;
  esPrincipal: boolean;
  activo: boolean;
}

export const metodoPagoService = {
  async listarMetodosPago(): Promise<MetodoPago[]> {
    const res = await api.get<ApiResponse<MetodoPago[]>>('/api/metodos-pago');
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error listando métodos de pago');
    // Normalizar respuesta: el backend retorna { metodosPago: [...] } dentro de data
    const payload = res.data.data as any;
    if (Array.isArray(payload)) return payload as MetodoPago[];
    if (payload && Array.isArray(payload.metodosPago)) return payload.metodosPago as MetodoPago[];
    // Fallback a array vacío para evitar errores en UI
    return [];
  },

  async agregarMetodoPago(payload: Partial<MetodoPago> & { tipo: string }): Promise<MetodoPago> {
    try {
      const res = await api.post<ApiResponse<MetodoPago>>('/api/metodos-pago', payload);
      if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error agregando método de pago');
      return res.data.data as MetodoPago;
    } catch (err: any) {
      // Intentar extraer mensaje de error enviado por el backend
      const serverMessage = err?.response?.data?.mensaje || err?.response?.data?.error?.mensaje;
      if (serverMessage) throw new Error(serverMessage);
      throw err;
    }
  },

  async eliminarMetodoPago(id: string): Promise<void> {
    await api.delete(`/api/metodos-pago/${id}`);
  },

  async marcarComoPrincipal(id: string): Promise<void> {
    await api.post(`/api/metodos-pago/${id}/principal`);
  },
};

export const listarMetodosPagoUsuario = metodoPagoService.listarMetodosPago;

export default metodoPagoService;
