import { useEffect, useState } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { Settings, Home, Calendar, ShoppingCart, Bell, User, ChevronDown, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { obtenerPerfilUsuario } from '../services/usuario.service';

interface ProfileScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToPaymentMethods?: () => void;
  onNotifications?: () => void;
  onNavigateToEditProfile?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToServices?: () => void;
}

export default function ProfileScreen({ 
  onNavigateBack,
  onNavigateToEditProfile,
  onNavigateToPaymentMethods,
  onNavigateToHistory,
  onNavigateToHome,
  onNotifications,
  onNavigateToServices
}: ProfileScreenProps) {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const handleNavigateToEditProfile = () => {
    if (onNavigateToEditProfile) {
      onNavigateToEditProfile();
    }
  };

  const handleNavigateToPaymentMethods = () => {
    if (onNavigateToPaymentMethods) {
      onNavigateToPaymentMethods();
    }
  };

  const handleNavigateToHistory = () => {
    if (onNavigateToHistory) {
      onNavigateToHistory();
    }
  };

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    obtenerPerfilUsuario()
      .then((data) => setUser(data))
      .catch((err) => setError(err?.message || 'Error al cargar perfil'))
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
      <div className="px-4 pt-11 animate-slide-down">
        <button 
          onClick={onNavigateBack}
          className="p-2.5 -ml-2.5 touch-manipulation"
        >
          <ArrowLeft size={24} className="text-black" strokeWidth={2} />
        </button>
      </div>

      {/* Tarjeta de Perfil del Usuario */}
      <div className="px-6 mt-6">
        <div 
          className="bg-white rounded-2xl px-6 py-5"
          style={{ boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)' }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-[100px] h-[100px] rounded-xl border-2 border-[#E0E0E0] overflow-hidden transition-transform duration-200 hover:scale-105"
                // ...existing code...
            >
              <ImageWithFallback
                src={user?.fotoPerfil || "https://images.unsplash.com/photo-1577516671418-d819625982a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsdWUlMjBoYWlyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxNjY4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                alt={user?.nombreCompleto || 'Avatar usuario'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Nombre completo */}
          <h2 className="text-center text-black mb-3" style={{ fontSize: '24px', fontWeight: '700' }}>
            {loading ? 'Cargando...' : (user?.nombreCompleto || 'Usuario sin nombre')}
          </h2>

          <div className="text-center text-[#555555] mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>
            <p>Tipo vehículo: {user?.tipoVehiculo || 'No especificado'}</p>
            <p>Placa: {user?.placaVehiculo || 'No especificada'}</p>
          </div>

          {/* Separador */}
          <div className="w-full h-px bg-[#E5E5E5] my-3"></div>
        </div>
      </div>

      {/* Tarjeta de Ajustes de la Cuenta */}
      <div className="px-6 mt-6">
        <div 
          className="bg-white rounded-2xl px-6 py-4"
          style={{ boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.07)' }}
        >
          {/* Título de sección */}
          <div className="mb-2">
            <p className="text-[#666666]" style={{ fontSize: '18px', fontWeight: '700' }}>
              Ajuste de la cuenta
            </p>
          </div>

          {/* Subtítulo */}
          <h3 className="text-black mb-4" style={{ fontSize: '22px', fontWeight: '700' }}>
            Configuracion
          </h3>

          {/* Separador */}
          <div className="w-full h-px bg-[#E5E5E5] mb-4"></div>

          {/* Acordeones */}
          <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']} className="w-full">
            {/* Ítem 1: Configuración de Cuenta */}
            <AccordionItem value="item-1" className="border-b border-[#E5E5E5] last:border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown size={20} className="text-black transition-transform duration-200" strokeWidth={2.5} />
                  <span className="text-black" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Configuración de Cuenta
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <button 
                  onClick={handleNavigateToEditProfile}
                  className="text-left ml-9 text-[#333333] hover:text-[#0066CC] transition-colors active:opacity-80 touch-manipulation"
                  style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '400' }}
                >
                  Nombre completo, Email, numero,<br />
                  Contraseña...
                </button>
              </AccordionContent>
            </AccordionItem>

            {/* Ítem 2: Mis Reservaciones */}
            <AccordionItem value="item-2" className="border-b border-[#E5E5E5] last:border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown size={20} className="text-black transition-transform duration-200" strokeWidth={2.5} />
                  <span className="text-black" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Mis Reservaciones
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <button 
                  onClick={handleNavigateToHistory}
                  className="text-left ml-9 text-[#333333] hover:text-[#0066CC] transition-colors active:opacity-80 touch-manipulation"
                  style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '400' }}
                >
                  Historial de tus reservas
                </button>
              </AccordionContent>
            </AccordionItem>

            {/* Ítem 3: Historial de Servicios */}
            <AccordionItem value="item-3" className="border-b border-[#E5E5E5] last:border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown size={20} className="text-black transition-transform duration-200" strokeWidth={2.5} />
                  <span className="text-black" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Historial de Servicios
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <p className="text-[#333333] ml-9 cursor-pointer hover:text-[#0066CC] transition-colors" style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '400' }}>
                  Mira que servicios usastes
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Ítem 4: Soporte / Ayuda */}
            <AccordionItem value="item-4" className="border-b border-[#E5E5E5] last:border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown size={20} className="text-black transition-transform duration-200" strokeWidth={2.5} />
                  <span className="text-black" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Soporte / Ayuda
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <p className="text-[#333333] ml-9 cursor-pointer hover:text-[#0066CC] transition-colors" style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '400' }}>
                  Necesitas ayuda aqui es el lugar
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Ítem 5: Métodos de Pago */}
            <AccordionItem value="item-5" className="border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown size={20} className="text-black transition-transform duration-200" strokeWidth={2.5} />
                  <span className="text-black" style={{ fontSize: '16px', fontWeight: '600' }}>
                    Métodos de Pago
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-0">
                <button 
                  onClick={handleNavigateToPaymentMethods}
                  className="text-[#333333] ml-9 text-left hover:text-[#0066CC] transition-colors active:opacity-80 touch-manipulation"
                  style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '400' }}
                >
                  Agregar un metodo de pago
                </button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        active="profile"
        onHome={onNavigateToHome}
        onServices={onNavigateToServices}
        onCart={() => {}}
        onNotifications={onNotifications}
        onProfile={onNavigateToEditProfile}
        badgeNotifications={0}
      />
    </motion.div>
  );
}