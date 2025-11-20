import { obtenerNotificacionPorId } from '../../../src/services/notificacion.service';
import axios from 'axios';
jest.mock('axios');

describe('notificacion.service', () => {
  it('debería obtener notificación por id', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { id: '1', titulo: 'Reservación confirmada' } });
    const data = await obtenerNotificacionPorId('1');
    expect(data.id).toBe('1');
    expect(data.titulo).toBe('Reservación confirmada');
  });

  it('lanza error si falla la petición', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Error de red'));
    await expect(obtenerNotificacionPorId('2')).rejects.toThrow('Error de red');
  });
});
