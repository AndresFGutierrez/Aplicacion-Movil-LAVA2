import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import backgroundImage from 'figma:asset/c4cf2833c6928dd7c2bafa0fc1c86d366f49179e.png';
import { authService } from '../services/auth.service';
import { setAccessToken, setRefreshToken } from '../services/api';

interface Props {
  onNavigateBack?: () => void;
  onCompleteSuccess?: () => void;
}

export default function CompleteDataScreen({ onNavigateBack, onCompleteSuccess }: Props) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('carro');
  const [placaVehiculo, setPlacaVehiculo] = useState('');
  const [cuidadoEspecial, setCuidadoEspecial] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de error
  const [nombreError, setNombreError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [numeroDocumentoError, setNumeroDocumentoError] = useState(false);
  const [ciudadError, setCiudadError] = useState(false);
  const [direccionError, setDireccionError] = useState(false);
  const [placaError, setPlacaError] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Resetear errores
    setNombreError(false);
    setTelefonoError(false);
    setNumeroDocumentoError(false);
    setCiudadError(false);
    setDireccionError(false);
    setPlacaError(false);
    
    let hasErrors = false;
    
    // Validar campos requeridos
    if (!nombreCompleto || !telefono || !numeroDocumento || !ciudad || !direccion || !placaVehiculo) {
      setNombreError(!nombreCompleto);
      setTelefonoError(!telefono);
      setNumeroDocumentoError(!numeroDocumento);
      setCiudadError(!ciudad);
      setDireccionError(!direccion);
      setPlacaError(!placaVehiculo);
      
      toast.error('Error', {
        description: 'Por favor, completa todos los campos obligatorios.',
        duration: 5000,
        style: {
          background: '#FFD8D6',
          border: '1.5px solid #FF3B30',
          color: '#333333',
        },
        classNames: {
          title: '!text-[#D70015] !font-bold',
          description: '!text-[#333333]',
        },
      });
      hasErrors = true;
    }
    
    if (!hasErrors) {
      setLoading(true);
      try {
        const payload = {
          nombreCompleto,
          telefono,
          tipoDocumento,
          numeroDocumento,
          ciudad,
          direccion,
          tipoVehiculo,
          placaVehiculo,
          cuidadoEspecial,
        };

        console.log('CompleteDataScreen - payload:', payload);
        // Llamar al servicio y guardar los nuevos tokens
        const respuesta = await authService.completarPerfil(payload);
        if (respuesta?.accessToken) setAccessToken(respuesta.accessToken);
        if (respuesta?.refreshToken) setRefreshToken(respuesta.refreshToken);
        toast.success('¡Perfil completado exitosamente!');
        setTimeout(() => {
          if (onCompleteSuccess) onCompleteSuccess();
        }, 800);
      } catch (err: any) {
        const mensaje = err?.response?.data?.mensaje || err?.message || 'Error completando perfil';
        toast.error('Error', { description: mensaje });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto overflow-hidden"
    >
      {/* Fondo ilustrativo con imagen */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 px-6 pt-11 pb-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-14">
          <h1 
            className="text-center tracking-[-0.03em]"
            style={{ 
              fontFamily: '"Lacquer", cursive',
              fontSize: '48px',
              lineHeight: '1',
              color: '#000000'
            }}
          >
            LAVA2
          </h1>
        </div>

        {/* Sección Título */}
        <div className="text-center mb-8">
          <h2 className="mb-2" style={{ fontSize: '28px', color: '#000000' }}>
            Completa tu Perfil
          </h2>
          <p className="text-[#555555]" style={{ fontSize: '16px' }}>
            Ingresa los datos necesarios para completar tu registro
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Nombre Completo */}
          <div className="relative">
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => {
                setNombreCompleto(e.target.value);
                setNombreError(false);
              }}
              placeholder="Nombre Completo"
              className={`w-full h-[52px] px-4 ${nombreError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                nombreError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {nombreError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div className="relative">
            <input
              type="tel"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                setTelefonoError(false);
              }}
              placeholder="Teléfono"
              className={`w-full h-[52px] px-4 ${telefonoError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                telefonoError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {telefonoError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Tipo de Documento */}
          <div className="relative">
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full h-[52px] px-4 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD] appearance-none"
              style={{ fontSize: '16px' }}
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PAS">Pasaporte</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Número de Documento */}
          <div className="relative">
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => {
                setNumeroDocumento(e.target.value);
                setNumeroDocumentoError(false);
              }}
              placeholder="Número de Documento"
              className={`w-full h-[52px] px-4 ${numeroDocumentoError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                numeroDocumentoError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {numeroDocumentoError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Ciudad */}
          <div className="relative">
            <input
              type="text"
              value={ciudad}
              onChange={(e) => {
                setCiudad(e.target.value);
                setCiudadError(false);
              }}
              placeholder="Ciudad"
              className={`w-full h-[52px] px-4 ${ciudadError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                ciudadError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {ciudadError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Dirección */}
          <div className="relative">
            <input
              type="text"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                setDireccionError(false);
              }}
              placeholder="Dirección"
              className={`w-full h-[52px] px-4 ${direccionError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                direccionError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {direccionError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Tipo de Vehículo */}
          <div className="relative">
            <select
              value={tipoVehiculo}
              onChange={(e) => setTipoVehiculo(e.target.value)}
              className="w-full h-[52px] px-4 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD] appearance-none"
              style={{ fontSize: '16px' }}
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="camioneta">Camioneta</option>
              <option value="van">Van</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Placa del Vehículo */}
          <div className="relative">
            <input
              type="text"
              value={placaVehiculo}
              onChange={(e) => {
                setPlacaVehiculo(e.target.value.toUpperCase());
                setPlacaError(false);
              }}
              placeholder="Placa del Vehículo"
              className={`w-full h-[52px] px-4 ${placaError ? 'pr-12' : ''} bg-white rounded-xl text-black uppercase ${
                placaError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {placaError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Cuidado Especial (Opcional) */}
          <div className="relative">
            <textarea
              value={cuidadoEspecial}
              onChange={(e) => setCuidadoEspecial(e.target.value)}
              placeholder="Cuidado Especial (Opcional)"
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD] resize-none"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Botón Completar Perfil */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[56px] bg-black text-white rounded-xl mb-6 active:opacity-80 active:scale-[0.98] transition-all touch-manipulation disabled:opacity-50"
            style={{ fontSize: '18px' }}
          >
            {loading ? 'Cargando...' : 'Completar Perfil'}
          </button>
        </form>

        {/* Botón Volver */}
        {onNavigateBack && (
          <div className="text-center">
            <button 
              onClick={onNavigateBack}
              className="text-[#0066CC] underline"
              style={{ fontSize: '16px' }}
            >
              Volver
            </button>
          </div>
        )}
      </div>

      {/* Fuente personalizada para el título */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
        `
      }} />
    </motion.div>
  );
}
