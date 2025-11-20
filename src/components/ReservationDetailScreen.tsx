import { useEffect, useState } from 'react';
import { ArrowLeft, Home, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { obtenerReservacionPorId } from '../services/reservacion.service';

interface ReservationDetailScreenProps {
  reservacionId: string;
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export default function ReservationDetailScreen({ reservacionId, onNavigateBack, onNavigateToHome, onNotifications, onNavigateToProfile }: ReservationDetailScreenProps) {
  const [reservacion, setReservacion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    obtenerReservacionPorId(reservacionId)
      .then((data) => setReservacion(data))
      .catch((err) => setError(err?.message || 'Error al cargar reservación'))
      .finally(() => setLoading(false));
  }, [reservacionId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto bg-[#F8F9FA] overflow-x-hidden pb-[83px]"
    >
      <div className="flex items-center justify-between px-4 pt-11">
        <button onClick={onNavigateBack} className="p-2.5 -ml-2.5 touch-manipulation">
          <ArrowLeft size={24} className="text-black" strokeWidth={2} />
        </button>
        <button onClick={onNotifications} className="relative p-2.5 -mr-2 touch-manipulation">
          <Bell size={24} className="text-black" strokeWidth={2} />
        </button>
      </div>
      <div className="px-6 mt-8">
        <h1 className="text-black mb-4" style={{ fontSize: '24px', fontWeight: '700' }}>
          Detalle de Reservación
        </h1>
        {loading ? (
          <div>Cargando reservación...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : reservacion ? (
          <div className="space-y-2">
            <div className="font-semibold text-black" style={{ fontSize: '16px' }}>{reservacion.servicio?.nombre}</div>
            <div className="text-[#555] text-sm">{reservacion.fechaHoraInicio}</div>
            <div className="text-xs mt-1 text-[#0066CC]">Estado: {reservacion.estado}</div>
            <div className="text-sm">Dirección: {reservacion.direccionServicio}</div>
            <div className="text-sm">Notas: {reservacion.notasCliente}</div>
          </div>
        ) : null}
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#E8F4FA] h-[83px] flex items-center justify-center gap-5 px-6" style={{ boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.08)' }}>
        <div className="flex items-center justify-around w-full max-w-[345px] pb-[34px]">
          <button onClick={onNavigateToHome} className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <Home size={28} className="text-[#666666]" strokeWidth={2} />
          </button>
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <User size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
