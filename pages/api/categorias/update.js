import { supabaseService } from '../../../supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { id, nombre } = req.body;

  try {
    const { error } = await supabaseService
      .from('categorias_deprimera')
      .update({ nombre })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
