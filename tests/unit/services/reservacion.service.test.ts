import { obtenerReservacionPorId } from '../../../src/services/reservacion.service';
import axios from 'axios';
jest.mock('axios');

describe('reservacion.service', () => {
  it('debería obtener reservación por id', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { id: '1', servicio: { nombre: 'Lavado' } } });
    const data = await obtenerReservacionPorId('1');
    expect(data.id).toBe('1');
    expect(data.servicio.nombre).toBe('Lavado');
  });

  it('lanza error si falla la petición', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Error de red'));
    await expect(obtenerReservacionPorId('2')).rejects.toThrow('Error de red');
  });
});
