import { useState } from 'react';
import { ArrowLeft, Calendar, Home, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { crearReservacion } from '../services/reservacion.service';

interface BookingCreateScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export default function BookingCreateScreen({ onNavigateBack, onNavigateToHome, onNotifications, onNavigateToProfile }: BookingCreateScreenProps) {
  const [form, setForm] = useState({
    servicioId: '',
    fechaHoraInicio: '',
    direccionServicio: '',
    notasCliente: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await crearReservacion({ ...form, fechaHoraInicio: new Date(form.fechaHoraInicio).toISOString() });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error al crear reservación');
    } finally {
      setLoading(false);
    }
  };

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
          Nueva Reservación
        </h1>
        {success ? (
          <div className="text-green-600">¡Reservación creada exitosamente!</div>
        ) : (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <input type="text" placeholder="ID Servicio" value={form.servicioId} onChange={e => handleChange('servicioId', e.target.value)} className="w-full p-2 border rounded" required />
            <input type="datetime-local" placeholder="Fecha y hora" value={form.fechaHoraInicio} onChange={e => handleChange('fechaHoraInicio', e.target.value)} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Dirección" value={form.direccionServicio} onChange={e => handleChange('direccionServicio', e.target.value)} className="w-full p-2 border rounded" required />
            <textarea placeholder="Notas" value={form.notasCliente} onChange={e => handleChange('notasCliente', e.target.value)} className="w-full p-2 border rounded" />
            <button type="submit" className="w-full h-[48px] bg-black text-white rounded-xl mt-4" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Reservación'}
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#E8F4FA] h-[83px] flex items-center justify-center gap-5 px-6" style={{ boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.08)' }}>
        <div className="flex items-center justify-around w-full max-w-[345px] pb-[34px]">
          <button onClick={onNavigateToHome} className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <Home size={28} className="text-[#666666]" strokeWidth={2} />
          </button>
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <Calendar size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
          </button>
          <button onClick={onNavigateToProfile} className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <User size={28} className="text-[#666666]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
