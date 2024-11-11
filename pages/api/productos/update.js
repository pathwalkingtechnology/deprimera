import { supabaseService } from '../../../supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { id, nombre, descripcion, precio, imageUrl } = req.body;

  try {
    const updates = { nombre, descripcion, precio };
    if (imageUrl) updates.imagen = imageUrl;

    const { error } = await supabaseService
      .from('productos_deprimera')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
