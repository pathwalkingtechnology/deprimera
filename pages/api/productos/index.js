// /pages/api/productos/index.js
import { supabaseService } from '../../../supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseService.from('productos_deprimera').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre, descripcion, precio, categoria_id, imagen } = req.body;
    const { data, error } = await supabaseService.from('productos_deprimera').insert([{ nombre, descripcion, precio, categoria_id, imagen }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
