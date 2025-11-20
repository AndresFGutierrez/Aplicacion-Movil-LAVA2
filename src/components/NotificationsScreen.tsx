import React, { useEffect, useState } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { ArrowLeft, Home, Calendar, ShoppingCart, Bell, User, Car, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';

interface NotificationsScreenProps {
  onNavigateBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToProfile?: () => void;
}

interface Notification {
  id: string;
  icon: 'car' | 'check';
  iconBgColor: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

import { listarNotificacionesUsuario } from '../services/notificacion.service';

export default function NotificationsScreen({ 
  onNavigateBack, 
  onNavigateToHome,
  onNavigateToProfile
}: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarNotificacionesUsuario()
      .then((data) => setNotifications(data?.notificaciones || []))
      .catch((err) => setError(err?.message || 'Error al cargar notificaciones'))
      .finally(() => setLoading(false));
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
      <div className="px-4 pt-11">
        {/* Flecha de retroceso */}
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-2 py-2.5 -ml-2 touch-manipulation"
          type="button"
        >
          <ArrowLeft size={24} className="text-black" strokeWidth={2} />
          <span className="text-black" style={{ fontSize: '16px', fontWeight: '500' }}>
            salir
          </span>
        </button>

        {/* Título */}
        <h1 className="text-black mt-8 text-center" style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
          Notificaciones
        </h1>
      </div>

      {/* Lista de notificaciones */}
      <ScrollArea className="px-6 mt-8 h-[calc(100vh-280px)]">
        <div className="space-y-4 pb-4">
          {loading ? (
            <div>Cargando notificaciones...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-[20px] p-4"
                style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
              >
                {/* Icono + Título */}
                <div className="flex items-start gap-3 mb-2">
                  <div 
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: notification.iconBgColor }}
                  >
                    {notification.icon === 'car' ? (
                      <Car size={20} className="text-white" strokeWidth={2.5} />
                    ) : (
                      <CheckCircle size={20} className="text-white" strokeWidth={2.5} />
                    )}
                  </div>
                  <h3 className="flex-1 text-black" style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.3' }}>
                    {notification.title}
                  </h3>
                </div>

                {/* Cuerpo */}
                <p className="text-[#555555] mb-2" style={{ fontSize: '14px', fontWeight: '400', lineHeight: '1.4' }}>
                  {notification.body}
                </p>

                {/* Timestamp */}
                <div className="flex justify-end">
                  <span className="text-[#999999]" style={{ fontSize: '12px', fontWeight: '400' }}>
                    {notification.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        active="notifications"
        onHome={onNavigateToHome}
        onServices={() => onNavigateToHome && onNavigateToHome()}
        onCart={() => {}}
        onNotifications={() => { /* already in this screen */ }}
        onProfile={onNavigateToProfile}
        badgeNotifications={notifications.filter(n => !n.isRead).length}
      />
    </motion.div>
  );
}

// Removed duplicate component implementation (kept the one with data fetching above).