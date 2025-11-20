
import { motion } from 'motion/react';
import { BottomNavBar } from './BottomNavBar';

interface MyBookingsScreenProps {
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToProfile?: () => void;
}

export default function MyBookingsScreen({
  onNavigateToHome,
  onNotifications,
  onNavigateToServices,
  onNavigateToProfile
}: MyBookingsScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto bg-[#F8F9FA] overflow-x-hidden pb-[83px]"
    >
      <div className="px-6 pt-16">
        <h1 className="text-black mb-4" style={{ fontSize: '24px', fontWeight: '700' }}>
          Mis reservaciones
        </h1>
        {/* Aquí irá el listado de reservaciones */}
        <div className="bg-white rounded-xl p-4 shadow-sm text-center text-[#555]">
          Próximamente verás tus reservaciones aquí.
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        active="services"
        onHome={onNavigateToHome}
        onServices={onNavigateToServices}
        onCart={() => {}}
        onNotifications={onNotifications}
        onProfile={onNavigateToProfile}
        badgeNotifications={0}
      />
    </motion.div>
  );
}
