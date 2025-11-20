import { crearCalificacion } from '../../../src/services/calificacion.service';
import axios from 'axios';
jest.mock('axios');

describe('calificacion.service', () => {
  it('envía la calificación correctamente', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
    const data = await crearCalificacion({ reservacionId: '1', calificacionServicio: 5 });
    expect(data.success).toBe(true);
  });

  it('lanza error si falla la petición', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Error de red'));
    await expect(crearCalificacion({ reservacionId: '2', calificacionServicio: 4 })).rejects.toThrow('Error de red');
  });
});
