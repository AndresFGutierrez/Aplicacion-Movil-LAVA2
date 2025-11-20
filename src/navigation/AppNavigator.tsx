import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import CompleteDataScreen from '../components/CompleteDataScreen';
import HomeScreen from '../components/HomeScreen';
import ServicesScreen from '../components/ServicesScreen';
import ServiceDetailScreen from '../components/ServiceDetailScreen';
import BookingScreen from '../components/BookingScreen';
import MyBookingsScreen from '../components/MyBookingsScreen';
import BookingDetailScreen from '../components/BookingDetailScreen';
import ProfileScreen from '../components/ProfileScreen';
import NotificationsScreen from '../components/NotificationsScreen';
import HistoryScreen from '../components/HistoryScreen';
import EditProfileScreen from '../components/EditProfileScreen';
import PaymentMethodsScreen from '../components/PaymentMethodsScreen';
import ReservationDetailScreen from '../components/ReservationDetailScreen';
import RatingScreen from '../components/RatingScreen';
import NotificationDetailScreen from '../components/NotificationDetailScreen';

import { useAuth } from '../context/AuthContext';
import WorkersListScreen from '../components/WorkersListScreen';
import WorkerDetailScreen from '../components/WorkerDetailScreen';

// Wrappers para rutas con params
function ReservationDetailWrapper() {
  const { id } = useParams();
  return <ReservationDetailScreen reservacionId={id || ''} onNavigateBack={() => window.history.back()} />;
}

function RatingWrapper() {
  const { reservacionId } = useParams();
  return <RatingScreen reservacionId={reservacionId || ''} onNavigateBack={() => window.history.back()} />;
}

function NotificationDetailWrapper() {
  const { id } = useParams();
  return <NotificationDetailScreen notificacionId={id || ''} onNavigateBack={() => window.history.back()} />;
}
function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppNavigator() {
    function CompleteDataWrapper() {
      const navigate = useNavigate();
      return (
        <CompleteDataScreen
          onNavigateBack={() => navigate('/register')}
          onCompleteSuccess={() => navigate('/')}
        />
      );
    }


    function LoginWrapper() {
      const navigate = useNavigate();
      return (
        <LoginScreen
          onNavigateToRegister={() => navigate('/register')}
          onLoginSuccess={() => navigate('/')}
        />
      );
    }
    function RegisterWrapper() {
      const navigate = useNavigate();
      return (
        <RegisterScreen
          onNavigateToLogin={() => navigate('/login')}
          onRegisterSuccess={() => navigate('/complete-data')}
        />
      );
    }
    function HomeWrapper() {
      const navigate = useNavigate();
      return (
        <HomeScreen
          onNavigateToProfile={() => navigate('/profile')}
          onNavigateToServices={() => navigate('/services')}
          onNavigateToReservation={() => navigate('/booking')}
          onOpenMessages={() => navigate('/notifications')}
          onNotifications={() => navigate('/notifications')}
          onExit={() => navigate('/login')}
          onNavigateToWorkers={() => navigate('/workers')}
        />
      );
    }
    function ServicesWrapper() {
      const navigate = useNavigate();
      return (
        <ServicesScreen
          onNavigateBack={() => window.history.back()}
          onNavigateToHome={() => navigate('/')}
          onNotifications={() => navigate('/notifications')}
        />
      );
    }
    function ProfileWrapper() {
      const navigate = useNavigate();
      return (
        <ProfileScreen
          onNavigateBack={() => window.history.back()}
          onNavigateToHome={() => navigate('/')}
          onNavigateToServices={() => navigate('/services')}
          onNotifications={() => navigate('/notifications')}
          onNavigateToEditProfile={() => navigate('/profile/edit')}
          onNavigateToPaymentMethods={() => navigate('/payment-methods')}
        />
      );
    }
    function EditProfileWrapper() {
      const navigate = useNavigate();
      return (
        <EditProfileScreen
          onNavigateBack={() => navigate('/profile')}
          onSaveSuccess={() => navigate('/profile')}
        />
      );
    }
    function PaymentMethodsWrapper() {
      const navigate = useNavigate();
      return (
        <PaymentMethodsScreen
          onNavigateBack={() => navigate('/profile')}
          onSaveSuccess={() => navigate('/profile')}
          onNavigateToHome={() => navigate('/')}
          onNotifications={() => navigate('/notifications')}
          onNavigateToServices={() => navigate('/services')}
        />
      );
    }
    function NotificationsWrapper() {
      const navigate = useNavigate();
      return (
        <NotificationsScreen
          onNavigateBack={() => window.history.back()}
          onNavigateToHome={() => navigate('/')}
          onNavigateToProfile={() => navigate('/profile')}
        />
      );
    }
    function WorkersListWrapper() {
      const navigate = useNavigate();
      return (
        <WorkersListScreen
          onNavigateBack={() => navigate('/')}
          onNavigateToHome={() => navigate('/')}
          onNavigateToServices={() => navigate('/services')}
          onWorkerClick={(workerId) => navigate(`/workers/${workerId}`)}
          onNotifications={() => navigate('/notifications')}
        />
      );
    }
    function WorkerDetailWrapper() {
      const { id } = useParams();
      const navigate = useNavigate();
      return (
        <WorkerDetailScreen
          workerId={id || ''}
          onNavigateBack={() => navigate('/workers')}
          onNavigateToHome={() => navigate('/')}
          onNotifications={() => navigate('/notifications')}
        />
      );
    }
    function MyBookingsWrapper() {
      const navigate = useNavigate();
      return (
        <MyBookingsScreen
          onNavigateToHome={() => navigate('/')}
          onNotifications={() => navigate('/notifications')}
          onNavigateToServices={() => navigate('/services')}
          onNavigateToProfile={() => navigate('/profile')}
        />
      );
    }
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<RegisterWrapper />} />
          <Route path="/complete-data" element={<PrivateRoute><CompleteDataWrapper /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><HomeWrapper /></PrivateRoute>} />
          <Route path="/services" element={<PrivateRoute><ServicesWrapper /></PrivateRoute>} />
          <Route path="/services/:id" element={<PrivateRoute><ServiceDetailScreen /></PrivateRoute>} />
          <Route path="/booking" element={<PrivateRoute><BookingScreen onNavigateBack={() => window.history.back()} /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><MyBookingsWrapper /></PrivateRoute>} />
          <Route path="/bookings/:id" element={<PrivateRoute><BookingDetailScreen /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfileWrapper /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfileWrapper /></PrivateRoute>} />
          <Route path="/payment-methods" element={<PrivateRoute><PaymentMethodsWrapper /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsWrapper /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryScreen onNavigateBack={() => window.history.back()} /></PrivateRoute>} />
          <Route path="/reservaciones/:id" element={<PrivateRoute><ReservationDetailWrapper /></PrivateRoute>} />
          <Route path="/calificar/:reservacionId" element={<PrivateRoute><RatingWrapper /></PrivateRoute>} />
          <Route path="/notificaciones/:id" element={<PrivateRoute><NotificationDetailWrapper /></PrivateRoute>} />
          <Route path="/workers" element={<PrivateRoute><WorkersListWrapper /></PrivateRoute>} />
          <Route path="/workers/:id" element={<PrivateRoute><WorkerDetailWrapper /></PrivateRoute>} />
          <Route path="*" element={<div style={{ padding: 24 }}>Ruta no encontrada</div>} />
        </Routes>
      </BrowserRouter>
    );
}






