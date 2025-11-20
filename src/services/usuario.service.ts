import api, { ApiResponse } from './api';

export interface PerfilUsuario {
  id: string;
  email: string;
  nombreCompleto?: string;
  telefono?: string;
  fotoPerfil?: string | null;
  ciudad?: string;
  direccion?: string;
  tipoVehiculo?: string;
  placaVehiculo?: string;
  cuidadoEspecial?: string | null;
}

export const usuarioService = {
  async obtenerPerfil(): Promise<PerfilUsuario> {
    const res = await api.get<ApiResponse<PerfilUsuario>>('/api/usuarios/perfil');
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error obteniendo perfil');
    return res.data.data as PerfilUsuario;
  },

  async actualizarPerfil(datos: Partial<PerfilUsuario>): Promise<PerfilUsuario> {
    const res = await api.put<ApiResponse<PerfilUsuario>>('/api/usuarios/perfil', datos);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error actualizando perfil');
    return res.data.data as PerfilUsuario;
  },

  async cambiarPassword(passwordActual: string, passwordNueva: string): Promise<void> {
    const res = await api.post<ApiResponse<null>>('/api/usuarios/cambiar-password', {
      passwordActual,
      passwordNueva,
    });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error cambiando contraseña');
  },
};

export const obtenerPerfilUsuario = usuarioService.obtenerPerfil;
export const actualizarPerfilUsuario = usuarioService.actualizarPerfil;

export default usuarioService;
