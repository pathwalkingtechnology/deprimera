import { supabaseService } from '../../../supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { nombre, descripcion, precio, categoriaId, imageUrl } = req.body;

  try {
    const { data, error } = await supabaseService
      .from('productos_deprimera')
      .insert([{ nombre, descripcion, precio, categoria_id: categoriaId, imagen: imageUrl }]);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
