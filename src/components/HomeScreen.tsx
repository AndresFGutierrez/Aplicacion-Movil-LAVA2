import { MessageCircle, Home, Calendar, ShoppingCart, Bell, User, ArrowLeft } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { listarServicios } from '../services/servicio.service';
import { listarTrabajadores } from '../services/trabajador.service';
import { listarReservacionesUsuario } from '../services/reservacion.service';
import { listarNotificacionesUsuario } from '../services/notificacion.service';

interface HomeScreenProps {
  onNavigateToProfile?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToReservation?: () => void;
  onOpenMessages?: () => void;
  onNotifications?: () => void;
  onExit?: () => void;
  onNavigateToWorkers?: () => void;
}

export default function HomeScreen({ 
  onNavigateToProfile,
  onNavigateToServices,
  onNavigateToReservation,
  onOpenMessages,
  onNotifications,
  onExit,
  onNavigateToWorkers,
  onHome
}: HomeScreenProps) {
  // Estados y carga de notificaciones (evita errores si no están definidos)
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loadingNoti, setLoadingNoti] = useState<boolean>(true);
  const [errorNoti, setErrorNoti] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const cargarNotificaciones = async () => {
      setLoadingNoti(true);
      setErrorNoti(false);
      try {
        const datos = await listarNotificacionesUsuario();
        if (!mounted) return;
        setNotificaciones(Array.isArray(datos) ? datos : []);
      } catch (err) {
        console.error('Error cargando notificaciones', err);
        if (mounted) setErrorNoti(true);
      } finally {
        if (mounted) setLoadingNoti(false);
      }
    };

    cargarNotificaciones();

    return () => { mounted = false; };
  }, []);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto bg-[#F8F9FA] overflow-x-hidden pb-[83px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-11">
        <div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 py-2.5 -ml-2 touch-manipulation active:opacity-70 transition-opacity"
            aria-label="Salir"
          >
            <ArrowLeft size={22} className="text-black" strokeWidth={2} />
            <span className="text-black" style={{ fontSize: '15px', fontWeight: 600 }}>Salir</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          

          <button
            onClick={onNotifications}
            className="p-2 relative touch-manipulation active:opacity-70"
            aria-label="Notificaciones"
          >
            <Bell size={20} className="text-[#333333]" />
            {/* badge */}
            {!loadingNoti && !errorNoti && notificaciones.filter(n => !n.leida).length > 0 && (
              <div className="absolute -top-1 -right-1 w-[16px] h-[16px] bg-[#FF3B30] rounded-full flex items-center justify-center">
                <span className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>
                  {notificaciones.filter(n => !n.leida).length}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onNavigateToProfile}
            className="p-2 touch-manipulation active:opacity-70"
            aria-label="Perfil"
          >
            <User size={20} className="text-[#333333]" />
          </button>
        </div>
      </div>
      {/* ...existing code... */}
      

      {/* Tarjetas */}
      <div className="px-6 mt-8 space-y-4">
        {/* Tarjeta 1: Mi perfil */}
        <button 
          onClick={onNavigateToProfile}
          className="w-full overflow-hidden rounded-2xl block text-left"
          style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <div className="relative h-[120px] w-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwcHJvZmVzc2lvbmFsJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNjY3Nzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Mi perfil"
              className="w-full h-full object-cover"
            />
            {/* Texto superpuesto */}
            <div className="absolute bottom-4 right-4 px-5 py-2 bg-black/25 rounded-lg backdrop-blur-sm">
              <span 
                className="text-white drop-shadow-lg"
                style={{ 
                  fontFamily: '"Permanent Marker", cursive',
                  fontSize: '24px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Mi perfil
              </span>
            </div>
          </div>
        </button>

        {/* Tarjeta 2: Servicios */}
        <button 
          onClick={onNavigateToServices}
          className="w-full overflow-hidden rounded-2xl block text-left"
          style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <div className="relative h-[140px] w-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1552930294-6b595f4c2974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3YXNoaW5nJTIwY2FyJTIwc2VydmljZXxlbnwxfHx8fDE3NjE2Njc3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Servicios"
              className="w-full h-full object-cover"
            />
            {/* Texto superpuesto */}
            <div className="absolute bottom-4 left-4">
              <span 
                className="text-white drop-shadow-lg"
                style={{ 
                  fontSize: '28px',
                  fontWeight: '700',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)'
                }}
              >
                Servicios
              </span>
            </div>
          </div>
        </button>

        {/* Tarjeta 3: Reservación */}
        <button 
          onClick={onNavigateToReservation}
          className="w-full overflow-hidden rounded-2xl block text-left"
          style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <div className="relative h-[140px] w-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760827797819-4361cd5cd353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXNoJTIwc3RhdGlvbiUyMHZlaGljbGVzfGVufDF8fHx8MTc2MTY2Nzc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Reservación"
              className="w-full h-full object-cover"
            />
            {/* Texto superpuesto */}
            <div className="absolute bottom-4 right-4">
              <span 
                className="text-white drop-shadow-lg"
                style={{ 
                  fontSize: '28px',
                  fontWeight: '700',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)'
                }}
              >
                Reservación
              </span>
            </div>
          </div>
        </button>

        {/* Tarjeta 4: Nuestros Trabajadores */}
        <button 
          onClick={onNavigateToWorkers}
          className="w-full overflow-hidden rounded-2xl block text-left"
          style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <div className="relative h-[140px] w-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1658809841225-80b03ca94f56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2VycyUyMHVuaWZvcm18ZW58MXx8fHwxNzYxNjY3NzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Nuestros Trabajadores"
              className="w-full h-full object-cover"
            />
            {/* Texto superpuesto */}
            <div className="absolute bottom-4 left-4">
              <span 
                className="text-white drop-shadow-lg"
                style={{ 
                  fontSize: '28px',
                  fontWeight: '700',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                  lineHeight: '1.1'
                }}
              >
                Nuestros<br />Trabajadores
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#E8F4FA] h-[83px] flex items-center justify-center gap-5 px-6"
        style={{ boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex items-center justify-around w-full max-w-[345px] pb-[34px]">
          {/* Home - Activo */}
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <Home size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
          </button>

          {/* Calendar - Inactivo */}
          <button 
            onClick={onNavigateToServices}
            className="flex items-center justify-center w-11 h-11 touch-manipulation"
          >
            <Calendar size={28} className="text-[#666666]" strokeWidth={2} />
          </button>

          {/* Shopping Cart - Inactivo */}
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <ShoppingCart size={28} className="text-[#666666]" strokeWidth={2} />
          </button>

          {/* Bell - Inactivo con badge */}
          <button 
            onClick={onNotifications}
            className="relative flex items-center justify-center w-11 h-11 touch-manipulation"
          >
            <Bell size={28} className="text-[#666666]" strokeWidth={2} />
            {/* Badge rojo */}
            {loadingNoti ? (
              <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>...</span>
              </div>
            ) : errorNoti ? null : (
              notificaciones.filter(n => !n.leida).length > 0 && (
                <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>
                    {notificaciones.filter(n => !n.leida).length}
                  </span>
                </div>
              )
            )}
          </button>

          {/* Perfil - Inactivo */}
          <button 
            onClick={onNavigateToProfile}
            className="flex items-center justify-center w-11 h-11 touch-manipulation"
          >
            <User size={28} className="text-[#666666]" strokeWidth={2} />
          </button>
        </div>
      </div>

      
    </motion.div>
  );
}