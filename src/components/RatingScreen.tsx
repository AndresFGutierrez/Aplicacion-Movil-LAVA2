import { useState } from 'react';
import { ArrowLeft, Home, Bell, User, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { crearCalificacion } from '../services/calificacion.service';

interface RatingScreenProps {
  reservacionId: string;
  trabajadorId?: string;
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export default function RatingScreen({ reservacionId, trabajadorId, onNavigateBack, onNavigateToHome, onNotifications, onNavigateToProfile }: RatingScreenProps) {
  const [servicio, setServicio] = useState(0);
  const [trabajador, setTrabajador] = useState(0);
  const [comentarioServicio, setComentarioServicio] = useState('');
  const [comentarioTrabajador, setComentarioTrabajador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await crearCalificacion({
        reservacionId,
        trabajadorId,
        calificacionServicio: servicio,
        calificacionTrabajador: trabajador || undefined,
        comentarioServicio,
        comentarioTrabajador,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error al enviar calificación');
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
          Calificar Servicio
        </h1>
        {success ? (
          <div className="text-green-600">¡Calificación enviada exitosamente!</div>
        ) : (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div>
              <label className="block mb-1">Calificación del servicio (obligatoria):</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setServicio(n)} className={servicio >= n ? 'text-yellow-400' : 'text-gray-300'}>
                    <Star size={28} fill={servicio >= n ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1">Calificación del trabajador (opcional):</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setTrabajador(n)} className={trabajador >= n ? 'text-yellow-400' : 'text-gray-300'}>
                    <Star size={28} fill={trabajador >= n ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="Comentario sobre el servicio" value={comentarioServicio} onChange={e => setComentarioServicio(e.target.value)} className="w-full p-2 border rounded" />
            <textarea placeholder="Comentario sobre el trabajador" value={comentarioTrabajador} onChange={e => setComentarioTrabajador(e.target.value)} className="w-full p-2 border rounded" />
            <button type="submit" className="w-full h-[48px] bg-black text-white rounded-xl mt-4" disabled={loading || servicio === 0}>
              {loading ? 'Enviando...' : 'Enviar Calificación'}
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
            <User size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
