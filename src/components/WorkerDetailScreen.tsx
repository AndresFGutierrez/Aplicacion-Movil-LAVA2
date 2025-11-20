import { ArrowLeft, Bell } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { ImageWithFallback } from './figma/ImageWithFallback';
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


interface WorkerDetailScreenProps {
  workerId: string;
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onOpenMessages?: () => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToServices?: () => void;
}


export default function WorkerDetailScreen({ 
  workerId,
  onNavigateBack, 
  onNavigateToHome,
  onOpenMessages,
  onNotifications,
  onNavigateToProfile,
  onNavigateToServices
}: WorkerDetailScreenProps) {
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
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      return (
        <svg
          key={index}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={filled ? '#FFD700' : 'none'}
          stroke={filled ? '#FFD700' : '#D1D5DB'}
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    });
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto overflow-x-hidden pb-[83px]"
    >
      {/* Fondo ilustrativo con imagen */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>


      {/* Contenido principal */}
      <div className="relative z-10">
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#00CC00" stroke="none">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          <span style={{ fontSize: '12px', color: '#00CC00', fontWeight: '600' }}>
                            {worker.thumbsUp}
                          </span>
                        </div>
                      )}
                      {worker.thumbsDown > 0 && (
                        <div className="flex items-center gap-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF0000" stroke="none">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                          </svg>
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


      {/* Bottom Navigation Bar usando el componente - AGREGADO z-50 para que esté por encima */}
      <div className="relative z-510">
        <BottomNavBar
          onHome={onNavigateToHome}
          onServices={onNavigateToServices}
          onCart={() => {}}
          onNotifications={onNotifications}
          onProfile={onNavigateToProfile}
          badgeNotifications={4}
        />
      </div>


      {/* Fuente personalizada */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
        `
      }} />
    </motion.div>
  );
}
