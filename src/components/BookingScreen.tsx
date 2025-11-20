import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Home, Bell, User, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { listarReservacionesUsuario, crearReservacion } from '../services/reservacion.service';
import { listarNotificacionesUsuario } from '../services/notificacion.service';

interface BookingScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export default function BookingScreen({ 
  onNavigateBack, 
  onNavigateToHome, 
  onNotifications, 
  onNavigateToProfile 
}: BookingScreenProps) {
  const [reservaciones, setReservaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para notificaciones
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loadingNoti, setLoadingNoti] = useState<boolean>(true);
  const [errorNoti, setErrorNoti] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarReservacionesUsuario()
      .then((data) => setReservaciones(data?.reservaciones || []))
      .catch((err) => setError(err?.message || 'Error al cargar reservaciones'))
      .finally(() => setLoading(false));
  }, []);

  // Cargar notificaciones
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
        <button onClick={onNavigateBack} className="p-2.5 -ml-2.5 touch-manipulation">
          <ArrowLeft size={24} className="text-black" strokeWidth={2} />
        </button>
        <button onClick={onNotifications} className="relative p-2.5 -mr-2 touch-manipulation">
          <Bell size={24} className="text-black" strokeWidth={2} />
          {/* Badge de notificaciones en header */}
          {!loadingNoti && !errorNoti && notificaciones.filter(n => !n.leida).length > 0 && (
            <div className="absolute -top-1 -right-1 w-[16px] h-[16px] bg-[#FF3B30] rounded-full flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>
                {notificaciones.filter(n => !n.leida).length}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="px-6 mt-8">
        <h1 className="text-black mb-4" style={{ fontSize: '24px', fontWeight: '700' }}>
          Mis Reservaciones
        </h1>
        {loading ? (
          <div>Cargando reservaciones...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            {reservaciones.map((res) => (
              <div key={res.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-black" style={{ fontSize: '16px' }}>{res.servicio?.nombre}</div>
                <div className="text-[#555] text-sm">{res.fechaHoraInicio}</div>
                <div className="text-xs mt-1 text-[#0066CC]">Estado: {res.estado}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Con 5 botones igual que HomeScreen */}
      <div 
        className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#E8F4FA] h-[83px] flex items-center justify-center gap-5 px-6" 
        style={{ boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex items-center justify-around w-full max-w-[345px] pb-[34px]">
          {/* Home - Inactivo */}
          <button 
            onClick={onNavigateToHome}
            className="flex items-center justify-center w-11 h-11 touch-manipulation"
          >
            <Home size={28} className="text-[#666666]" strokeWidth={2} />
          </button>

          {/* Calendar - Activo */}
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <Calendar size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
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
