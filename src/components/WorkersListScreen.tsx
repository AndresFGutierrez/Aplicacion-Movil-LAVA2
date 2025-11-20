import { ArrowLeft, Home, Calendar, ShoppingCart, Bell, User, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNavBar } from './BottomNavBar';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { listarTrabajadores } from '../services/trabajador.service';
import backgroundImage from 'figma:asset/c4cf2833c6928dd7c2bafa0fc1c86d366f49179e.png';

interface Worker {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  thumbsUp: number;
  thumbsDown: number;
  specialty: string;
  experience: string;
}

interface WorkersListScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onOpenMessages?: () => void;
  onWorkerClick: (workerId: string) => void;
  onNotifications?: () => void;
  onNavigateToServices?: () => void;
}

export default function WorkersListScreen({ 
  onNavigateBack, 
  onNavigateToHome,
  onOpenMessages,
  onWorkerClick,
  onNotifications,
  onNavigateToServices
}: WorkersListScreenProps) {
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarTrabajadores()
      .then((data) => setTrabajadores(data?.trabajadores || []))
      .catch((err) => setError(err?.message || 'Error al cargar trabajadores'))
      .finally(() => setLoading(false));
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(rating) ? 'text-[#FFD700]' : 'text-gray-300'}
        fill={index < Math.floor(rating) ? '#FFD700' : 'none'}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto overflow-x-hidden"
    >
      {/* Fondo ilustrativo con imagen */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Contenido principal con padding bottom para la barra de navegación */}
      <div className="relative z-10 pb-[100px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-11">
          <button 
            onClick={onNavigateBack}
            className="flex items-center gap-2 py-2.5 -ml-2 touch-manipulation active:opacity-70 transition-opacity"
          >
            <ArrowLeft size={24} className="text-black" strokeWidth={2} />
            <span className="text-black" style={{ fontSize: '16px', fontWeight: '500' }}>
              salir
            </span>
          </button>

          {/* Notificaciones con badge */}
          <button 
            onClick={onNotifications}
            className="relative p-2.5 -mr-2 touch-manipulation active:opacity-70 transition-opacity"
          >
            <Bell size={24} className="text-black" strokeWidth={2} />
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>
                4
              </span>
            </div>
          </button>
        </div>

        {/* Título principal */}
        <div className="px-6 mt-8 mb-6">
          <h1 className="text-black text-center" style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
            ¿Quién cuidará tu vehículo?
          </h1>
        </div>

        {/* Lista de trabajadores */}
        <div className="px-6 space-y-4 pb-6">
          {loading && (
            <div className="text-center text-[#555555]" style={{ fontSize: '16px' }}>
              Cargando trabajadores...
            </div>
          )}
          
          {error && (
            <div className="text-center text-[#FF3B30]" style={{ fontSize: '16px' }}>
              {error}
            </div>
          )}
          
          {!loading && !error && trabajadores.map((worker) => (
            <button
              key={worker.id}
              onClick={() => onWorkerClick(worker.id)}
              className="w-full bg-white rounded-xl p-4 text-left touch-manipulation active:scale-[0.98] transition-transform"
              style={{ boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)' }}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-[70px] h-[70px] rounded-full border-2 border-[#E5E5E5] overflow-hidden shrink-0 bg-gray-100">
                  <ImageWithFallback
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  {/* Nombre */}
                  <h3 className="text-black mb-1" style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.2' }}>
                    {worker.name}
                  </h3>
                  
                  {/* Rating con estrellas */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(worker.rating)}
                    </div>
                    <span className="text-black" style={{ fontSize: '14px', fontWeight: '500' }}>
                      ({typeof worker.rating === 'number' ? worker.rating.toFixed(1) : 'N/A'})
                    </span>
                    {/* Thumbs */}
                    <div className="flex items-center gap-1 ml-1">
                      {worker.thumbsUp > 0 && (
                        <div className="flex items-center gap-0.5">
                          <ThumbsUp size={14} className="text-[#00CC00]" fill="#00CC00" strokeWidth={0} />
                          <span style={{ fontSize: '12px', color: '#00CC00', fontWeight: '600' }}>
                            {worker.thumbsUp}
                          </span>
                        </div>
                      )}
                      {worker.thumbsDown > 0 && (
                        <div className="flex items-center gap-0.5">
                          <ThumbsDown size={14} className="text-[#FF0000]" fill="#FF0000" strokeWidth={0} />
                          <span style={{ fontSize: '12px', color: '#FF0000', fontWeight: '600' }}>
                            {worker.thumbsDown}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Especialidad */}
                  <div className="mb-2">
                    <span className="text-[#333333]" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Especialidad:{' '}
                    </span>
                    <span className="text-[#555555]" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                      {worker.specialty}
                    </span>
                  </div>
                  
                  {/* Experiencia */}
                  <div className="mb-3">
                    <span className="text-[#333333]" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Experiencia:{' '}
                    </span>
                    <span className="text-[#555555]" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                      {worker.experience}
                    </span>
                  </div>
                  
                  {/* Botón Reseñas */}
                  <div className="flex justify-end">
                    <div 
                      className="px-4 py-1.5 bg-[#E5F2FF] border border-[#0066CC] rounded-lg"
                      style={{ fontSize: '14px', fontWeight: '500', color: '#0066CC' }}
                    >
                      Ver reseñas
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar (shared) */}
      <BottomNavBar
        onHome={onNavigateToHome}
        onServices={onNavigateToServices}
        onCart={() => {}}
        onNotifications={onNotifications}
        onProfile={() => {}}
        badgeNotifications={0}
      />

      {/* Fuente personalizada */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
          
          .safe-area-inset-bottom {
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }
        `
      }} />
    </motion.div>
  );
}
