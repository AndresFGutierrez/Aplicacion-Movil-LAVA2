import { Home, Calendar, ShoppingCart, Bell, User } from 'lucide-react';
import React from 'react';

interface BottomNavBarProps {
  active?: 'home' | 'services' | 'cart' | 'notifications' | 'profile';
  onHome?: () => void;
  onServices?: () => void;
  onCart?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  badgeNotifications?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  active,
  onHome,
  onServices,
  onCart,
  onNotifications,
  onProfile,
  badgeNotifications = 0,
}) => (
  <div
    className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#E8F4FA] h-[83px] flex items-center justify-center gap-5 px-6"
    style={{ boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.08)', zIndex: 999 }}
  >
    <div className="flex items-center justify-around w-full max-w-[345px] pb-[34px]">
      {/* Home */}
      <button
        onClick={active !== 'home' ? onHome : undefined}
        className={`flex items-center justify-center w-11 h-11 touch-manipulation ${active === 'home' ? '' : 'opacity-80'}`}
        aria-label="Ir a Home"
      >
        <Home
          size={28}
          className={active === 'home' ? 'text-black' : 'text-[#666666]'}
          strokeWidth={active === 'home' ? 2.5 : 2}
          fill={active === 'home' ? 'currentColor' : undefined}
        />
      </button>
      {/* Services */}
      <button
        onClick={active !== 'services' ? onServices : undefined}
        className={`flex items-center justify-center w-11 h-11 touch-manipulation ${active === 'services' ? '' : 'opacity-80'}`}
        aria-label="Ir a Servicios"
      >
        <Calendar
          size={28}
          className={active === 'services' ? 'text-black' : 'text-[#666666]'}
          strokeWidth={active === 'services' ? 2.5 : 2}
          fill={active === 'services' ? 'currentColor' : undefined}
        />
      </button>
      {/* Cart */}
      <button
        onClick={active !== 'cart' ? onCart : undefined}
        className={`flex items-center justify-center w-11 h-11 touch-manipulation ${active === 'cart' ? '' : 'opacity-80'}`}
        aria-label="Ir a Carrito"
      >
        <ShoppingCart
          size={28}
          className={active === 'cart' ? 'text-black' : 'text-[#666666]'}
          strokeWidth={active === 'cart' ? 2.5 : 2}
          fill={active === 'cart' ? 'currentColor' : undefined}
        />
      </button>
      {/* Notifications */}
      <button
        onClick={active !== 'notifications' ? onNotifications : undefined}
        className={`relative flex items-center justify-center w-11 h-11 touch-manipulation ${active === 'notifications' ? '' : 'opacity-80'}`}
        aria-label="Ir a Notificaciones"
      >
        <Bell
          size={28}
          className={active === 'notifications' ? 'text-black' : 'text-[#666666]'}
          strokeWidth={active === 'notifications' ? 2.5 : 2}
          fill={active === 'notifications' ? 'currentColor' : undefined}
        />
        {badgeNotifications > 0 && (
          <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center">
            <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>
              {badgeNotifications}
            </span>
          </div>
        )}
      </button>
      {/* Profile */}
      <button
        onClick={active !== 'profile' ? onProfile : undefined}
        className={`flex items-center justify-center w-11 h-11 touch-manipulation ${active === 'profile' ? '' : 'opacity-80'}`}
        aria-label="Ir a Perfil"
      >
        <User
          size={28}
          className={active === 'profile' ? 'text-black' : 'text-[#666666]'}
          strokeWidth={active === 'profile' ? 2.5 : 2}
          fill={active === 'profile' ? 'currentColor' : undefined}
        />
      </button>
    </div>
  </div>
);
