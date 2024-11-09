import { NextApiRequest, NextApiResponse } from 'next';
import { uploadImage } from '../../lib/supabaseClient';

const subirImagenApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const imagen = req.body.imagen;
        const url = await uploadImage(imagen);
        return res.status(201).json({ mensaje: 'Imagen subida con éxito', url });
      } catch (error) {
        return res.status(500).json({ mensaje: 'Error al subir imagen' });
      }
    default:
      return res.status(405).json({ mensaje: 'Método no permitido' });
  }
};

export default subirImagenApi;
