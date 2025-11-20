import { render, screen, waitFor } from '@testing-library/react';
import NotificationDetailScreen from '../../../src/components/NotificationDetailScreen';
import * as notificacionService from '../../../src/services/notificacion.service';

jest.mock('../../../src/services/notificacion.service');

describe('NotificationDetailScreen', () => {
  const mockNotificacion = {
    id: '1',
    titulo: 'Reservación confirmada',
    mensaje: 'Tu reservación ha sido confirmada',
    tipo: 'reservacion',
    leida: true,
  };

  beforeEach(() => {
    (notificacionService.obtenerNotificacionPorId as jest.Mock).mockResolvedValue(mockNotificacion);
  });

  it('muestra los datos de la notificación', async () => {
    render(<NotificationDetailScreen notificacionId="1" onNavigateBack={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('Reservación confirmada')).toBeInTheDocument();
      expect(screen.getByText('Tu reservación ha sido confirmada')).toBeInTheDocument();
      expect(screen.getByText('Tipo: reservacion')).toBeInTheDocument();
      expect(screen.getByText('Leída: Sí')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla el fetch', async () => {
    (notificacionService.obtenerNotificacionPorId as jest.Mock).mockRejectedValue(new Error('Error de red'));
    render(<NotificationDetailScreen notificacionId="2" onNavigateBack={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar notificación/)).toBeInTheDocument();
    });
  });
});
