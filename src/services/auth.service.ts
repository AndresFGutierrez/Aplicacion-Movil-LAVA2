import api, { ApiResponse, setAccessToken, setRefreshToken } from './api';

export interface ReqLogin {
  email: string;
  password: string;
}

export interface ReqRegistro {
  email: string;
  password: string;
  nombreCompleto: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  ciudad: string;
  direccion: string;
  tipoVehiculo: string;
  placaVehiculo: string;
  cuidadoEspecial?: string;
}

export interface RespuestaLogin {
  usuario: any;
  accessToken?: string;
  refreshToken?: string;
}

export const authService = {
  async iniciarSesion(datos: ReqLogin): Promise<RespuestaLogin> {
    const res = await api.post<ApiResponse<RespuestaLogin>>('/api/auth/login', datos);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error al iniciar sesión');

    const payload = res.data.data as RespuestaLogin;

    if (payload.accessToken) setAccessToken(payload.accessToken);
    if (payload.refreshToken) setRefreshToken(payload.refreshToken as any);

    return payload;
  },

  async registrarUsuario(datos: ReqRegistro): Promise<RespuestaLogin> {
    const res = await api.post<ApiResponse<RespuestaLogin>>('/api/auth/registro', datos);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error al registrar usuario');

    const payload = res.data.data as RespuestaLogin;

    if (payload.accessToken) setAccessToken(payload.accessToken);
    if (payload.refreshToken) setRefreshToken(payload.refreshToken as any);

    return payload;
  },

  async registrarUsuarioInicial(datos: { email: string; password: string }): Promise<RespuestaLogin> {
    const res = await api.post<ApiResponse<RespuestaLogin>>('/api/auth/registro-inicial', datos);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error al registrar usuario');

    const payload = res.data.data as RespuestaLogin;

    if (payload.accessToken) setAccessToken(payload.accessToken);
    if (payload.refreshToken) setRefreshToken(payload.refreshToken as any);

    return payload;
  },

  async completarPerfil(datos: any): Promise<any> {
    const res = await api.put<ApiResponse<any>>('/api/usuarios/completar-perfil', datos);
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'Error completando perfil');
    return res.data.data;
  },

  async renovarToken(refreshToken?: string): Promise<{ accessToken: string }> {
    const res = await api.post<ApiResponse<{ accessToken: string }>>('/api/auth/refresh-token', { refreshToken });
    if (!res.data?.success) throw new Error(res.data?.mensaje || 'No se pudo renovar token');
    const data = res.data.data as { accessToken: string };
    if (data.accessToken) setAccessToken(data.accessToken);
    return data;
  },

  async cerrarSesion(refreshToken?: string): Promise<void> {
    await api.post<ApiResponse<null>>('/api/auth/logout', { refreshToken });
    setAccessToken(null);
    setRefreshToken(null);
  },
};

// Named exports para compatibilidad con pantallas existentes
export const iniciarSesion = (datos: ReqLogin) => authService.iniciarSesion(datos);
export const registrarUsuario = (datos: ReqRegistro) => authService.registrarUsuario(datos as any);
export const renovarToken = (refreshToken?: string) => authService.renovarToken(refreshToken);
export const cerrarSesion = (refreshToken?: string) => authService.cerrarSesion(refreshToken);
