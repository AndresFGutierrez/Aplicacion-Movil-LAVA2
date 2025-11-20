import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Home, Calendar, ShoppingCart, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';
import { obtenerHistorialReservacionesUsuario } from '../services/reservacion.service';

interface HistoryScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
}

export default function HistoryScreen({ onNavigateBack, onNavigateToHome, onNotifications }: HistoryScreenProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto bg-[#F8F9FA] overflow-x-hidden pb-[83px]"
    >
      {/* Header con flecha de retroceso */}
      <div className="px-4 pt-11">
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-2 p-2.5 -ml-2.5 touch-manipulation"
        >
          <ArrowLeft size={24} className="text-black" strokeWidth={2} />
          <span className="text-black" style={{ fontSize: '16px', fontWeight: '500' }}>
            salir
          </span>
        </button>
      </div>

      {/* Título principal */}
      <div className="px-6 mt-8 text-center">
        <h1 className="text-black mb-3" style={{ fontSize: '28px', fontWeight: '700' }}>
          Historial de Servicios
        </h1>
        <p className="text-[#555555]" style={{ fontSize: '16px', lineHeight: '1.4' }}>
          Revisa tus reservas pasadas y califícalas si lo deseas.
        </p>
      </div>

      {/* Lista de historial - Scrollable */}
      <div className="px-6 mt-6 space-y-4 pb-4">
        {loading ? (
          <div>Cargando historial...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          history.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-4 w-full cursor-pointer active:scale-[0.98] transition-transform"
              style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
              onClick={() => {/* handleDetailsClick(res.id) */}}
            >
              {/* Fecha */}
              <div className="mb-2">
                <p className="text-[#333333]" style={{ fontSize: '16px', fontWeight: '500' }}>
                  {res.fechaHoraInicio?.slice(0,10) || ''}
                </p>
              </div>
              {/* Detalles del servicio */}
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-10 h-10 bg-[#E5F2FF] rounded-full flex items-center justify-center">
                  {/* <Car size={20} className="text-[#0066CC]" strokeWidth={2} /> */}
                </div>
                <div className="flex-1">
                  <h3 className="text-black mb-1" style={{ fontSize: '18px', fontWeight: '600' }}>
                    {res.servicio?.nombre || res.servicioId}
                  </h3>
                  <p className="text-[#555555] mb-1" style={{ fontSize: '14px' }}>
                    Por: {res.trabajador?.nombreCompleto || 'Sin asignar'}
                  </p>
                  <p className="text-[#555555] mb-2" style={{ fontSize: '14px' }}>
                    Costo: ${res.precioFinal}
                  </p>
                  {/* Rating con estrellas */}
                  {res.calificacion && (
                    <div className="flex items-center gap-1">
                      {/* Renderizar estrellas según calificacionServicio */}
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star 
                          key={index}
                          size={16}
                          className={index < res.calificacion.calificacionServicio ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}
                          fill={index < res.calificacion.calificacionServicio ? '#FFD700' : 'none'}
                          strokeWidth={2}
                        />
                      ))}
                      <span className="text-[#555555] ml-1" style={{ fontSize: '14px' }}>
                        {res.calificacion.calificacionServicio}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Botón de acción */}
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implementar acción de calificar/detalles si aplica
                  }}
                  className="bg-[#E5F2FF] px-5 py-2.5 rounded-xl active:opacity-80 transition-opacity"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: '#0066CC'
                  }}
                >
                  Detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation Bar */}
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

          {/* Calendar - Inactivo */}
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
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
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>
                4
              </span>
            </div>
          </button>

          {/* Perfil - ACTIVO (porque venimos de Perfil) */}
          <button className="flex items-center justify-center w-11 h-11 touch-manipulation">
            <User size={28} className="text-black" strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}