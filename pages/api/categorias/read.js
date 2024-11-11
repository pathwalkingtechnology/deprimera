import { supabaseService } from '../../../supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { data, error } = await supabaseService
      .from('categorias_deprimera')
      .select('id, nombre');

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
