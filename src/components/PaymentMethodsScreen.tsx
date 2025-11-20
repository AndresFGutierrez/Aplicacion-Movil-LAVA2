import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { listarMetodosPagoUsuario, metodoPagoService } from '../services/metodoPago.service';
import { toast } from 'sonner';
import { BottomNavBar } from './BottomNavBar';

interface PaymentMethodsScreenProps {
  onNavigateBack: () => void;
  onSaveSuccess: () => void;
  onNavigateToHome?: () => void;
  onNotifications?: () => void;
  onNavigateToServices?: () => void;
}

export default function PaymentMethodsScreen({ 
  onNavigateBack, 
  onSaveSuccess, 
  onNavigateToHome, 
  onNotifications, 
  onNavigateToServices 
}: PaymentMethodsScreenProps) {
  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ 
    tipo: 'tarjeta_credito', 
    ultimos4Digitos: '', 
    nombreTitular: '', 
    fechaExpiracion: '', 
    marca: '' 
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    listarMetodosPagoUsuario()
      .then((data) => setMetodosPago(data))
      .catch((err) => setError(err?.message || 'Error al cargar métodos de pago'))
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarMetodosPagoUsuario();
      setMetodosPago(data);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    // Validación básica cliente antes de enviar al servidor
    if (!form.tipo || !form.nombreTitular) {
      toast.error('Error', {
        description: 'Completa el tipo y el nombre del titular',
        duration: 5000,
        style: {
          background: '#FFD8D6',
          border: '1.5px solid #FF3B30',
          color: '#333333',
        },
        classNames: {
          title: '!text-[#D70015] !font-bold',
          description: '!text-[#333333]',
        },
      });
      return;
    }

    const tiposTarjeta = ['tarjeta_credito', 'tarjeta_debito'];
    const marcasValidas = ['Visa', 'Mastercard', 'American Express', 'Diners'];

    if (tiposTarjeta.includes(form.tipo)) {
      // ultimos4Digitos: obligatorio y numérico de 4 dígitos
      if (!form.ultimos4Digitos || form.ultimos4Digitos.trim().length !== 4 || !/^[0-9]{4}$/.test(form.ultimos4Digitos)) {
        toast.error('Error', {
          description: 'Los últimos 4 dígitos deben tener exactamente 4 números',
          duration: 5000,
          style: {
            background: '#FFD8D6',
            border: '1.5px solid #FF3B30',
            color: '#333333',
          },
          classNames: {
            title: '!text-[#D70015] !font-bold',
            description: '!text-[#333333]',
          },
        });
        return;
      }

      // nombreTitular mínimo 3 caracteres
      if (!form.nombreTitular || form.nombreTitular.trim().length < 3) {
        toast.error('Error', {
          description: 'El nombre del titular debe tener al menos 3 caracteres',
          duration: 5000,
          style: {
            background: '#FFD8D6',
            border: '1.5px solid #FF3B30',
            color: '#333333',
          },
          classNames: {
            title: '!text-[#D70015] !font-bold',
            description: '!text-[#333333]',
          },
        });
        return;
      }

      // fechaExpiracion MM/YY
      if (!form.fechaExpiracion || !/^\d{2}\/\d{2}$/.test(form.fechaExpiracion)) {
        toast.error('Error', {
          description: 'La fecha de expiración debe tener formato MM/YY',
          duration: 5000,
          style: {
            background: '#FFD8D6',
            border: '1.5px solid #FF3B30',
            color: '#333333',
          },
          classNames: {
            title: '!text-[#D70015] !font-bold',
            description: '!text-[#333333]',
          },
        });
        return;
      }

      // normalizar marca y validar si es una de las permitidas
      const marcaNormalized = (form.marca || '').trim();
      const marcaMatch = marcasValidas.find((m) => m.toLowerCase() === marcaNormalized.toLowerCase());
      if (!marcaMatch) {
        toast.error('Error', {
          description: `La marca debe ser una de: ${marcasValidas.join(', ')}`,
          duration: 5000,
          style: {
            background: '#FFD8D6',
            border: '1.5px solid #FF3B30',
            color: '#333333',
          },
          classNames: {
            title: '!text-[#D70015] !font-bold',
            description: '!text-[#333333]',
          },
        });
        return;
      }
      // Reescribir marca para enviar exactamente como espera el backend
      form.marca = marcaMatch;
    }

    setAdding(true);
    try {
      await metodoPagoService.agregarMetodoPago({
        tipo: form.tipo,
        ultimos4Digitos: form.ultimos4Digitos || null,
        nombreTitular: form.nombreTitular,
        fechaExpiracion: form.fechaExpiracion || undefined,
        marca: form.marca || undefined,
      } as any);
      toast.success('¡Método de pago agregado exitosamente!');
      setShowForm(false);
      setForm({ tipo: 'tarjeta_credito', ultimos4Digitos: '', nombreTitular: '', fechaExpiracion: '', marca: '' });
      await refresh();
    } catch (err: any) {
      toast.error('Error', { description: err?.message || 'Error agregando método de pago' });
    } finally {
      setAdding(false);
    }
  };

  // Función para obtener el ícono de marca de tarjeta
  const getCardIcon = (marca: string) => {
    const marcaLower = marca?.toLowerCase() || '';
    if (marcaLower.includes('visa')) return '💳';
    if (marcaLower.includes('master')) return '💳';
    if (marcaLower.includes('amex') || marcaLower.includes('american')) return '💳';
    if (marcaLower.includes('nequi')) return '💰';
    if (marcaLower.includes('daviplata')) return '💰';
    return '💳';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto overflow-x-hidden"
      style={{
        background: 'linear-gradient(180deg, #E8F4FA 0%, #D0E8F5 50%, #B8DCF0 100%)'
      }}
    >
      {/* Contenido principal con padding bottom aumentado cuando el formulario está abierto */}
      <div className={`relative z-10 ${showForm ? 'pb-[200px]' : 'pb-[120px]'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-11">
          <button 
            onClick={onNavigateBack}
            className="flex items-center gap-2 py-2.5 -ml-2 touch-manipulation active:opacity-70 transition-opacity"
          >
            <ArrowLeft size={24} className="text-black" strokeWidth={2} />
            <span className="text-black" style={{ fontSize: '16px', fontWeight: '500' }}>
              Volver
            </span>
          </button>
        </div>

        {/* Título principal */}
        <div className="px-6 mt-8 mb-6">
          <h1 className="text-black" style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.2' }}>
            Métodos de pago
          </h1>
          <p className="text-[#555555] mt-2" style={{ fontSize: '16px' }}>
            Administra tus tarjetas y cuentas
          </p>
        </div>

        {/* Botón Agregar método */}
        <div className="px-6 mb-6">
          <button 
            onClick={() => setShowForm(prev => !prev)}
            className="w-full h-[56px] rounded-xl flex items-center justify-center gap-2 active:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
            style={{ 
              fontSize: '18px',
              fontWeight: '500',
              background: showForm ? '#555555' : '#000000',
              color: '#FFFFFF'
            }}
          >
            <CreditCard size={20} />
            {showForm ? 'Cancelar' : 'Agregar nuevo método'}
          </button>
        </div>

        {/* Formulario para agregar método */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mb-6"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-black mb-4" style={{ fontSize: '18px', fontWeight: '600' }}>
                Nuevo método de pago
              </h3>
              
              {/* Tipo de método */}
              <div className="mb-4">
                <label className="block text-[#333333] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Tipo de método
                </label>
                <div className="relative">
                  <select 
                    value={form.tipo} 
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    className="w-full h-[52px] px-4 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD] appearance-none"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="tarjeta_credito">Tarjeta de crédito</option>
                    <option value="tarjeta_debito">Tarjeta de débito</option>
                    <option value="pse">PSE</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Nombre titular */}
              <div className="mb-4">
                <label className="block text-[#333333] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Nombre del titular
                </label>
                <input
                  type="text"
                  value={form.nombreTitular}
                  onChange={(e) => handleChange('nombreTitular', e.target.value)}
                  placeholder="Como aparece en la tarjeta"
                  className="w-full h-[52px] px-4 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD]"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Grid de 3 campos */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Marca */}
                <div>
                  <label className="block text-[#333333] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Marca
                  </label>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={(e) => handleChange('marca', e.target.value)}
                    placeholder="Visa"
                    className="w-full h-[52px] px-3 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD]"
                    style={{ fontSize: '14px' }}
                  />
                </div>

                {/* Últimos 4 dígitos */}
                <div>
                  <label className="block text-[#333333] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Últimos 4
                  </label>
                  <input
                    type="text"
                    value={form.ultimos4Digitos}
                    onChange={(e) => handleChange('ultimos4Digitos', e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full h-[52px] px-3 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD]"
                    style={{ fontSize: '14px' }}
                  />
                </div>

                {/* Expiración */}
                <div>
                  <label className="block text-[#333333] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Exp.
                  </label>
                  <input
                    type="text"
                    value={form.fechaExpiracion}
                    onChange={(e) => handleChange('fechaExpiracion', e.target.value)}
                    placeholder="MM/YY"
                    className="w-full h-[52px] px-3 bg-white rounded-xl text-black border-[1.5px] border-[#DDDDDD]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Botones de acción - AQUÍ ESTÁN VISIBLES */}
              <div className="flex gap-3 mb-2">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  type="button"
                  className="flex-1 h-[52px] bg-[#0066CC] text-white rounded-xl active:opacity-80 transition-opacity disabled:opacity-50 font-medium"
                  style={{ fontSize: '16px', fontWeight: '500' }}
                >
                  {adding ? 'Guardando...' : '💾 Guardar'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  type="button"
                  className="flex-1 h-[52px] bg-[#F5F5F5] text-black rounded-xl active:opacity-80 transition-opacity font-medium"
                  style={{ fontSize: '16px', fontWeight: '500' }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de métodos de pago */}
        <div className="px-6 mb-8">
          {loading ? (
            <div className="text-center text-[#555555]" style={{ fontSize: '16px' }}>
              Cargando métodos de pago...
            </div>
          ) : error ? (
            <div className="text-center text-[#FF3B30]" style={{ fontSize: '16px' }}>
              {error}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.isArray(metodosPago) && metodosPago.length > 0 ? (
                metodosPago.map((method) => (
                  <div 
                    key={method.id} 
                    className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Ícono de tarjeta */}
                        <div className="w-12 h-12 bg-[#E5F2FF] rounded-xl flex items-center justify-center text-2xl">
                          {getCardIcon(method.marca)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-black font-semibold" style={{ fontSize: '16px' }}>
                              {method.marca || 'Tarjeta'}
                            </span>
                            {method.esPrincipal && (
                              <span className="px-2 py-0.5 bg-[#E5F2FF] text-[#0066CC] rounded-md" style={{ fontSize: '11px', fontWeight: '600' }}>
                                PRINCIPAL
                              </span>
                            )}
                          </div>
                          <div className="text-[#555555]" style={{ fontSize: '14px' }}>
                            {method.tipo === 'tarjeta_credito' ? 'Crédito' : 
                             method.tipo === 'tarjeta_debito' ? 'Débito' : 
                             method.tipo.toUpperCase()} •••• {method.ultimos4Digitos}
                          </div>
                        </div>
                      </div>

                      {/* Botón editar */}
                      <button
                        className="ml-3 px-4 py-2 bg-[#E5F2FF] border border-[#0066CC] rounded-xl text-[#0066CC] active:opacity-70 transition-opacity"
                        style={{ fontSize: '14px', fontWeight: '500' }}
                        onClick={() => {}}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={32} className="text-[#CCCCCC]" />
                  </div>
                  <p className="text-[#666666]" style={{ fontSize: '16px' }}>
                    No hay métodos de pago registrados
                  </p>
                  <p className="text-[#999999] mt-1" style={{ fontSize: '14px' }}>
                    Agrega uno para continuar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        active="profile"
        onHome={onNavigateToHome}
        onServices={onNavigateToServices}
        onCart={() => {}}
        onNotifications={onNotifications}
        onProfile={() => {}}
        badgeNotifications={4}
      />

      {/* Fuente personalizada */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
        `
      }} />
    </motion.div>
  );
}
