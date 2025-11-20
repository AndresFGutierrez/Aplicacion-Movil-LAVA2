import { useState, useEffect } from 'react';
import { ArrowLeft, User, ChevronDown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import backgroundImage from 'figma:asset/c4cf2833c6928dd7c2bafa0fc1c86d366f49179e.png';
import { actualizarPerfilUsuario, obtenerPerfilUsuario } from '../services/usuario.service';

interface EditProfileScreenProps {
  onNavigateBack: () => void;
  onSaveSuccess?: () => void;
}

export default function EditProfileScreen({ onNavigateBack, onSaveSuccess }: EditProfileScreenProps) {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>('https://images.unsplash.com/photo-1577516671418-d819625982a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsdWUlMjBoYWlyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNjY4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialData = {
    nombre: 'Alison',
    apellidos: 'Perez Sanchez',
    tipoDocumento: 'CC',
    numeroDocumento: '1234567890',
    metodoPago: 'Nequi',
    numeroCuenta: '3001234567',
    modeloMarca: 'Chevrolet Onix',
    placa: 'ZGO 679',
    ciudad: 'Bogotá',
    direccion: 'Calle 123 #45-67',
    cuidadoEspecial: ''
  };
  const [formData, setFormData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasChanges(changed);
  }, [formData]);

  // Cargar perfil del backend para precargar el formulario
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const perfil = await obtenerPerfilUsuario();
        if (!mounted) return;
        // Mapear campos del backend a los campos del formulario
        const nombreCompleto = perfil.nombreCompleto || '';
        const parts = nombreCompleto.trim().split(/\s+/);
        const nombre = parts.shift() || '';
        const apellidos = parts.join(' ');

        setFormData({
          nombre,
          apellidos,
          tipoDocumento: perfil.tipoDocumento || '',
          numeroDocumento: perfil.numeroDocumento || '',
          metodoPago: '',
          numeroCuenta: '',
          modeloMarca: perfil.tipoVehiculo || '',
          placa: perfil.placaVehiculo || '',
          ciudad: perfil.ciudad || '',
          direccion: perfil.direccion || '',
          cuidadoEspecial: perfil.cuidadoEspecial || ''
        });

        if (perfil.fotoPerfil) setProfileImage(perfil.fotoPerfil as string);
      } catch (err) {
        // no bloquear la pantalla si falla
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleUpload = () => {
    toast.success('Funcionalidad de cambio de foto disponible');
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No hay cambios para guardar');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Mapear campos del formulario al payload esperado por la API
      const payload: any = {
        nombreCompleto: `${formData.nombre} ${formData.apellidos}`.trim(),
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        tipoVehiculo: formData.modeloMarca,
        placaVehiculo: formData.placa,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        cuidadoEspecial: formData.cuidadoEspecial || null,
      };

      await actualizarPerfilUsuario(payload);
      toast.success('¡Cambios guardados!');
      setTimeout(() => {
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }, 600);
    } catch (err: any) {
      setError(err?.message || 'Error al guardar cambios');
      toast.error('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <div className="flex items-center mb-10">
          <button onClick={onNavigateBack} className="p-2.5 -ml-2.5 touch-manipulation">
            <ArrowLeft size={24} className="text-black" strokeWidth={2.5} />
          </button>
          <h1 
            className="ml-5 tracking-[-0.03em]"
            style={{ 
              fontFamily: '"Permanent Marker", cursive',
              fontSize: '48px',
              lineHeight: '1',
              color: '#000000'
            }}
          >
            LAVA2
          </h1>
        </div>

        {/* Título principal */}
        <div className="text-center mb-6">
          <h2 className="mb-2" style={{ fontSize: '28px', color: '#000000', fontWeight: '700' }}>
            Editar Perfil
          </h2>
          <p className="text-[#555555]" style={{ fontSize: '16px', lineHeight: '1.4' }}>
            Actualiza tus datos personales.<br />
            ¡Modifica lo que necesites!
          </p>
        </div>

        {/* Upload de foto de perfil */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="bg-white rounded-[20px] w-[100px] h-[100px] flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.07)' }}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Círculo de avatar */}
              <div className="w-[100px] h-[100px] bg-[#E5E5E5] rounded-[20px] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <ImageWithFallback 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User size={40} className="text-[#999999]" strokeWidth={1.5} />
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={handleUpload}
            className="mt-2 bg-[#F5F5F5] px-4 py-1.5 rounded-[20px] text-black active:opacity-80 transition-opacity"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Cambiar foto
          </button>
        </div>

        {/* Formulario en Grid de 2 columnas */}
        <div className="space-y-4 mb-8">
          {/* Fila 1: Nombre y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={(e) => updateFormData('nombre', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Apellidos
              </label>
              <input
                type="text"
                placeholder="Ingresa tu apellido"
                value={formData.apellidos}
                onChange={(e) => updateFormData('apellidos', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Fila 2: Tipo de Documento y # de Documento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Tipo de Documento
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tipo de documento"
                  value={formData.tipoDocumento}
                  onChange={(e) => updateFormData('tipoDocumento', e.target.value)}
                  className="w-full h-[52px] px-4 pr-10 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                  style={{ fontSize: '16px' }}
                />
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                # de Documento
              </label>
              <input
                type="text"
                placeholder="Numero de documento"
                value={formData.numeroDocumento}
                onChange={(e) => updateFormData('numeroDocumento', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Fila 3: Método de Pago y # de Cuenta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Metodo de Pago
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Selecciona metodo de pago"
                  value={formData.metodoPago}
                  onChange={(e) => updateFormData('metodoPago', e.target.value)}
                  className="w-full h-[52px] px-4 pr-10 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                  style={{ fontSize: '16px' }}
                />
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                # de Cuenta
              </label>
              <input
                type="text"
                placeholder="Numero de cuenta"
                value={formData.numeroCuenta}
                onChange={(e) => updateFormData('numeroCuenta', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Fila 4: Modelo y marca del vehículo y Placa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Modelo y marca del vehículo
              </label>
              <input
                type="text"
                placeholder="Tipo de Carro"
                value={formData.modeloMarca}
                onChange={(e) => updateFormData('modeloMarca', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Placa
              </label>
              <input
                type="text"
                placeholder="Placa del Vehiculo"
                value={formData.placa}
                onChange={(e) => updateFormData('placa', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Fila 5: Ciudad y Dirección */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Ciudad
              </label>
              <input
                type="text"
                placeholder="Ingresa ciudad de residencia"
                value={formData.ciudad}
                onChange={(e) => updateFormData('ciudad', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-black" style={{ fontSize: '15px', fontWeight: '600' }}>
                Direccion
              </label>
              <input
                type="text"
                placeholder="Ingresa tu direccion"
                value={formData.direccion}
                onChange={(e) => updateFormData('direccion', e.target.value)}
                className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>

        {/* Pregunta adicional */}
        <div className="mb-8">
          <label className="block mb-2 text-black" style={{ fontSize: '16px', fontWeight: '500' }}>
            ¿Tu vehículo requiere cuidado especial?
          </label>
          <input
            type="text"
            placeholder=""
            value={formData.cuidadoEspecial}
            onChange={(e) => updateFormData('cuidadoEspecial', e.target.value)}
            className="w-full h-[52px] px-4 bg-white border-[1.5px] border-[#DDDDDD] rounded-xl placeholder:text-[#999999]"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Botón Guardar Cambios */}
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`w-full h-[56px] rounded-xl active:scale-[0.98] transition-all touch-manipulation ${
            hasChanges 
              ? 'bg-black text-white active:opacity-90' 
              : 'bg-[#CCCCCC] text-[#888888] cursor-not-allowed'
          }`}
          style={{ fontSize: '18px', fontWeight: '600' }}
        >
          Guardar Cambios
        </button>
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