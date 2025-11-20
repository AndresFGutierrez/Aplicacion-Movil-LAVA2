import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import backgroundImage from 'figma:asset/c4cf2833c6928dd7c2bafa0fc1c86d366f49179e.png';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess?: () => void;
}

export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetear estados de error y alerta
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setAlertMessage(null);
    
    let hasErrors = false;
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validar campos vacíos
    if (!email || !password || !confirmPassword) {
      setEmailError(!email);
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
      setAlertMessage('Por favor, completa todos los campos para continuar.');
      hasErrors = true;
    }
    
    // Validar formato de email
    if (email && !emailRegex.test(email)) {
      setEmailError(true);
      setAlertMessage('Por favor, ingresa un correo electrónico válido.');
      hasErrors = true;
    }
    
    // Validar longitud de contraseña
    if (password && password.length < 6) {
      setPasswordError(true);
      setAlertMessage('La contraseña debe tener al menos 6 caracteres.');
      hasErrors = true;
    }
    
    // Validar que las contraseñas coincidan
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError(true);
      setAlertMessage('Las contraseñas no coinciden.');
      hasErrors = true;
    }
    
    if (!hasErrors) {
      try {
        await register({ email, password } as any);
        toast.success('¡Registro exitoso!');
        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
        }, 800);
      } catch (error: any) {
        const msg = error?.message || 'Error al registrar';
        setAlertMessage(msg);
        toast.error('Error', { description: msg });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative min-h-screen w-full max-w-[393px] mx-auto overflow-hidden"
    >
      {/* Fondo ilustrativo con imagen */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10 px-6 pt-11 pb-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-14">
          <h1 
            className="text-center tracking-[-0.03em]"
            style={{ 
              fontFamily: '"Lacquer", cursive',
              fontSize: '48px',
              lineHeight: '1',
              color: '#000000'
            }}
          >
            LAVA2
          </h1>
        </div>

        {/* Sección Crear Cuenta */}
        <div className="text-center mb-8">
          <h2 className="mb-2" style={{ fontSize: '28px', color: '#000000' }}>
            Crear Cuenta
          </h2>
          <p className="text-[#555555]" style={{ fontSize: '16px' }}>
            Ingresa tu email y contraseña para registrarte en la app
          </p>
        </div>

        {/* Alert de errores (front/backend) */}
        {alertMessage && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#FFD8D6] border border-[#FF3B30] flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle size={20} className="text-[#D70015]" />
            </div>
            <div className="flex-1 text-[#333333]" style={{ fontSize: '14px' }}>
              <div className="font-semibold text-[#D70015]">Error</div>
              <div>{alertMessage}</div>
            </div>
            <button aria-label="Cerrar alerta" onClick={() => setAlertMessage(null)} className="text-[#D70015] font-bold">✕</button>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-2">
          {/* Campo Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
                setAlertMessage(null);
              }}
              placeholder="Correo electrónico"
              className={`w-full h-[52px] px-4 ${emailError ? 'pr-12' : ''} bg-white rounded-xl text-black ${
                emailError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            {/* Icono de error */}
            {emailError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
                setAlertMessage(null);
              }}
              placeholder="Contraseña"
              className={`w-full h-[52px] px-4 ${passwordError ? 'pr-20' : 'pr-12'} bg-white rounded-xl text-black ${
                passwordError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${passwordError ? 'right-12' : 'right-4'} top-1/2 -translate-y-1/2 ${
                passwordError ? 'text-[#CCCCCC]' : 'text-[#999999] hover:text-black'
              } transition-colors`}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {/* Icono de error */}
            {passwordError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(false);
                setAlertMessage(null);
              }}
              placeholder="Confirmar Contraseña"
              className={`w-full h-[52px] px-4 ${confirmPasswordError ? 'pr-20' : 'pr-12'} bg-white rounded-xl text-black ${
                confirmPasswordError 
                  ? 'border-2 border-[#FF3B30]' 
                  : 'border-[1.5px] border-[#DDDDDD]'
              }`}
              style={{ fontSize: '16px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${confirmPasswordError ? 'right-12' : 'right-4'} top-1/2 -translate-y-1/2 ${
                confirmPasswordError ? 'text-[#CCCCCC]' : 'text-[#999999] hover:text-black'
              } transition-colors`}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {/* Icono de error */}
            {confirmPasswordError && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FF3B30] rounded-sm flex items-center justify-center">
                <AlertTriangle size={14} className="text-white fill-white" strokeWidth={0} />
                <span className="absolute text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>

          {/* Toggle: Mostrar contraseñas */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <label 
              htmlFor="show-passwords" 
              className="text-[#333333] cursor-pointer"
              style={{ fontSize: '15px', fontWeight: '400' }}
            >
              Mostrar contraseñas
            </label>
            <Switch
              id="show-passwords"
              checked={showPassword}
              onCheckedChange={setShowPassword}
              className="data-[state=checked]:bg-[#0066CC]"
            />
          </div>

          {/* Botón Registrarse */}
          <button 
            type="submit"
            className="w-full h-[56px] bg-black text-white rounded-xl mb-10 active:opacity-80 active:scale-[0.98] transition-all touch-manipulation"
            style={{ fontSize: '18px' }}
          >
            Registrarse
          </button>
        </form>

        {/* Opciones de Login Social */}
        <div className="space-y-4 mb-8">
          {/* Continuar con Gmail */}
          <button className="w-full h-[52px] bg-white border-[1.5px] border-[#DDDDDD] rounded-xl flex items-center justify-center gap-3 active:opacity-90 transition-opacity touch-manipulation">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-black" style={{ fontSize: '16px' }}>Continuar con Gmail</span>
          </button>

          {/* Continuar con Apple */}
          <button className="w-full h-[52px] bg-white border-[1.5px] border-[#DDDDDD] rounded-xl flex items-center justify-center gap-3 active:opacity-90 transition-opacity touch-manipulation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08l.01-.01-.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
            </svg>
            <span className="text-black" style={{ fontSize: '16px' }}>Continuar con Apple</span>
          </button>
        </div>

        {/* Términos y Política */}
        <p className="text-center text-[#666666] mb-8 px-6" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          Al hacer clic en registrarse, aceptas nuestros{' '}
          <a href="#" className="text-[#0066CC] underline">Términos de servicio</a>
          {' '}y{' '}
          <a href="#" className="text-[#0066CC] underline">Política de privacidad</a>.
        </p>

        {/* Sección ¿Ya tienes cuenta? */}
        <div className="text-center">
          <p className="mb-4" style={{ fontSize: '18px', color: '#000000' }}>
            ¿Ya tienes cuenta?
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="w-full h-[56px] bg-black text-white rounded-xl flex items-center justify-center active:opacity-90 active:scale-[0.98] transition-all touch-manipulation" 
            style={{ fontSize: '18px' }}
          >
            Inicia sesión
          </button>
        </div>
      </div>

      {/* Fuente personalizada para el título */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lacquer&display=swap');
        `
      }} />
    </motion.div>
  );
}
