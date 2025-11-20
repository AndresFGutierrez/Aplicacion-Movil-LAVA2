import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RatingScreen from '../../../src/components/RatingScreen';
import * as calificacionService from '../../../src/services/calificacion.service';

jest.mock('../../../src/services/calificacion.service');

describe('RatingScreen', () => {
  beforeEach(() => {
    (calificacionService.crearCalificacion as jest.Mock).mockResolvedValue({});
  });

  it('envía la calificación correctamente', async () => {
    render(<RatingScreen reservacionId="1" onNavigateBack={() => {}} />);
    fireEvent.click(screen.getAllByRole('button')[1]); // Selecciona 1 estrella servicio
    fireEvent.click(screen.getByText('Enviar Calificación'));
    await waitFor(() => {
      expect(screen.getByText(/¡Calificación enviada exitosamente!/)).toBeInTheDocument();
    });
  });

  it('muestra error si falla el envío', async () => {
    (calificacionService.crearCalificacion as jest.Mock).mockRejectedValue(new Error('Error de red'));
    render(<RatingScreen reservacionId="2" onNavigateBack={() => {}} />);
    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getByText('Enviar Calificación'));
    await waitFor(() => {
      expect(screen.getByText(/Error al enviar calificación/)).toBeInTheDocument();
    });
  });
});
