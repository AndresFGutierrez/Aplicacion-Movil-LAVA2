import { ArrowLeft, Bell } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { listarServicios } from '../services/servicio.service';
import backgroundImage from 'figma:asset/c4cf2833c6928dd7c2bafa0fc1c86d366f49179e.png';

interface ServicesScreenProps {
  onNavigateBack: () => void;
  onNavigateToHome?: () => void;
  onOpenMessages?: () => void;
  onServiceDetails?: (serviceId: string) => void;
  onNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export default function ServicesScreen({ 
  onNavigateBack, 
  onNavigateToHome,
  onOpenMessages,
  onServiceDetails,
  onNotifications,
  onNavigateToProfile
}: ServicesScreenProps) {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Definir servicios premium con sus IDs y URLs de imágenes
  const premiumServiceIds = ['pulido-encerado', 'lavado-premium', 'detallado-completo'];
  
  // Mapeo de imágenes por nombre/id de servicio
  const serviceImages = {
    // Servicios Premium
    'pulido-encerado': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop',
    'pulido': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop',
    'encerado': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop',
    'lavado-premium': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop',
    'premium': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop',
    'detallado-completo': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
    'detallado': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
    
    // Servicios Básicos y Disponibles
    'lavado-basico': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
    'basico': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
    'lavado-exterior': 'https://images.unsplash.com/photo-1607860108690-18eb8c9b9be4?w=400&h=300&fit=crop',
    'exterior': 'https://images.unsplash.com/photo-1607860108690-18eb8c9b9be4?w=400&h=300&fit=crop',
    'lavado-interior': 'https://images.unsplash.com/photo-1600087626120-062700394a01?w=400&h=300&fit=crop',
    'interior': 'https://images.unsplash.com/photo-1600087626120-062700394a01?w=400&h=300&fit=crop',
    'aspirado': 'https://images.unsplash.com/photo-1586943759813-e8e7cf647e5e?w=400&h=300&fit=crop',
    'limpieza-tapiceria': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
    'tapiceria': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
    'limpieza-motor': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    'motor': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    'limpieza-rines': 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400&h=300&fit=crop',
    'rines': 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400&h=300&fit=crop',
    'cambio-aceite': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop',
    'aceite': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop',
    'revision-general': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
    'revision': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
    'alineacion-balanceo': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
    'alineacion': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
    'balanceo': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
    
    // Imagen por defecto
    'default': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  };

  useEffect(() => {
    setLoading(true);
    listarServicios()
      .then((data) => setServicios(data?.servicios || []))
      .catch((err) => setError(err?.message || 'Error al cargar servicios'))
      .finally(() => setLoading(false));
  }, []);

  // Filtrar servicios premium (Pulido y encerado, Lavado premium, Detallado completo)
  const premiumServices = servicios.filter((s: any) => 
    premiumServiceIds.includes(s.id) || 
    s.nombre?.toLowerCase().includes('pulido') || 
    s.nombre?.toLowerCase().includes('premium') || 
    s.nombre?.toLowerCase().includes('detallado completo')
  );

  // Todos los servicios disponibles (sin filtrar)
  const availableServices = servicios;

  const handleServiceClick = (serviceId: string) => {
    if (onServiceDetails) {
      onServiceDetails(serviceId);
    }
  };

  // Función para obtener imagen de servicio
  const getServiceImage = (service: any, isPremium: boolean = false) => {
    const serviceId = service.id?.toLowerCase() || '';
    const serviceName = service.nombre?.toLowerCase() || '';
    
    // Si ya tiene imagenUrl, usarla (excepto para servicios premium o lavado básico)
    if (service.imagenUrl && !isPremium && !serviceName.includes('lavado basico') && !serviceName.includes('basico')) {
      return service.imagenUrl;
    }
    
    // Buscar coincidencia exacta por ID
    if (serviceImages[serviceId]) {
      return serviceImages[serviceId];
    }
    
    // Buscar por palabras clave en el nombre
    const keywords = serviceName.split(' ');
    for (const keyword of keywords) {
      if (serviceImages[keyword]) {
        return serviceImages[keyword];
      }
    }
    
    // Buscar coincidencias parciales
    for (const [key, value] of Object.entries(serviceImages)) {
      if (serviceName.includes(key) || serviceId.includes(key)) {
        return value;
      }
    }
    
    // Imagen por defecto
    return serviceImages['default'];
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
          {/* Botón salir */}
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
            {/* Badge rojo */}
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF3B30] rounded-full flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '12px', fontWeight: '700' }}>
                4
              </span>
            </div>
          </button>
        </div>

        {/* Título principal */}
        <div className="px-6 mt-8 mb-8">
          <h1 className="text-black text-center" style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
            Conoce nuestros servicios
          </h1>
        </div>

        {/* Sección: Servicios Premiums */}
        <div className="mt-6">
          <h2 className="text-black px-6 mb-4" style={{ fontSize: '22px', fontWeight: '700' }}>
            Servicios Premiums
          </h2>
          
          {loading ? (
            <div className="px-6 text-[#555555]" style={{ fontSize: '16px' }}>Cargando servicios...</div>
          ) : error ? (
            <div className="px-6 text-[#FF3B30]" style={{ fontSize: '16px' }}>{error}</div>
          ) : (
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-4 px-6" style={{ minWidth: 'min-content' }}>
                {premiumServices.length > 0 ? (
                  premiumServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="shrink-0 bg-white rounded-xl overflow-hidden text-left touch-manipulation active:scale-[0.98] transition-transform shadow-sm"
                      style={{ 
                        width: '180px',
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      {/* Badge Premium */}
                      <div className="relative">
                        <div className="absolute top-2 right-2 bg-[#FFD700] px-2 py-1 rounded-md z-10">
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#000' }}>★ PREMIUM</span>
                        </div>
                        {/* Imagen */}
                        <div className="w-full h-[130px] overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={getServiceImage(service, true)}
                            alt={service.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-3">
                        <h3 className="text-black mb-2" style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.2' }}>
                          {service.nombre}
                        </h3>
                        <div className="text-[#555555] mb-3 line-clamp-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {service.descripcion}
                        </div>
                        
                        {/* Botón Detalles */}
                        <div className="flex justify-center">
                          <div 
                            className="px-4 py-2 bg-[#0066CC] rounded-xl"
                            style={{ fontSize: '14px', fontWeight: '500', color: '#FFFFFF' }}
                          >
                            Ver detalles
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-[#555555]" style={{ fontSize: '16px' }}>No hay servicios premium disponibles</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sección: Servicios disponibles */}
        <div className="mt-8">
          <h2 className="text-black px-6 mb-4" style={{ fontSize: '22px', fontWeight: '700' }}>
            Servicios disponibles
          </h2>
          
          {loading ? (
            <div className="px-6 text-[#555555]" style={{ fontSize: '16px' }}>Cargando servicios...</div>
          ) : error ? (
            <div className="px-6 text-[#FF3B30]" style={{ fontSize: '16px' }}>{error}</div>
          ) : (
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-4 px-6" style={{ minWidth: 'min-content' }}>
                {availableServices.length > 0 ? (
                  availableServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="shrink-0 bg-white rounded-xl overflow-hidden text-left touch-manipulation active:scale-[0.98] transition-transform shadow-sm"
                      style={{ 
                        width: '180px',
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      {/* Imagen */}
                      <div className="w-full h-[130px] overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={getServiceImage(service, false)}
                          alt={service.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Contenido */}
                      <div className="p-3">
                        <h3 className="text-black mb-2" style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.2' }}>
                          {service.nombre}
                        </h3>
                        <div className="text-[#555555] mb-3 line-clamp-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {service.descripcion}
                        </div>
                        
                        {/* Botón Detalles */}
                        <div className="flex justify-center">
                          <div 
                            className="px-4 py-2 bg-[#E5F2FF] border border-[#0066CC] rounded-xl"
                            style={{ fontSize: '14px', fontWeight: '500', color: '#0066CC' }}
                          >
                            Ver detalles
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-[#555555]" style={{ fontSize: '16px' }}>No hay servicios disponibles</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Espaciado final */}
        <div className="h-8"></div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        active="services"
        onHome={onNavigateToHome}
        onServices={() => navigate('/services')}
        onCart={() => navigate('/cart')}
        onNotifications={onNotifications}
        onProfile={() => navigate('/profile')}
        badgeNotifications={0}
      />

      {/* Fuente personalizada para el título */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </motion.div>
  );
}
