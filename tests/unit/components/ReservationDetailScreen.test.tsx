import { render, screen, waitFor } from '@testing-library/react';
import ReservationDetailScreen from '../../../src/components/ReservationDetailScreen';
import * as reservacionService from '../../../src/services/reservacion.service';

jest.mock('../../../src/services/reservacion.service');

describe('ReservationDetailScreen', () => {
  const mockReservacion = {
    id: '1',
    servicio: { nombre: 'Lavado Premium' },
    fechaHoraInicio: '2025-11-20T10:00:00Z',
    estado: 'confirmed',
    direccionServicio: 'Calle 123',
    notasCliente: 'Sin mascotas',
  };

  beforeEach(() => {
    (reservacionService.obtenerReservacionPorId as jest.Mock).mockResolvedValue(mockReservacion);
  });

  it('muestra los datos de la reservación', async () => {
    render(<ReservationDetailScreen reservacionId="1" onNavigateBack={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('Lavado Premium')).toBeInTheDocument();
      expect(screen.getByText('Estado: confirmed')).toBeInTheDocument();
      expect(screen.getByText('Dirección: Calle 123')).toBeInTheDocument();
      expect(screen.getByText('Notas: Sin mascotas')).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si falla el fetch', async () => {
    (reservacionService.obtenerReservacionPorId as jest.Mock).mockRejectedValue(new Error('Error de red'));
    render(<ReservationDetailScreen reservacionId="2" onNavigateBack={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar reservación/)).toBeInTheDocument();
    });
  });
});
