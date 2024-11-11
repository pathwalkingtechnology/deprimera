import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente anónimo para operaciones regulares
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Cliente de rol de servicio para operaciones protegidas
const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabaseAnon, supabaseService };

// Funciones para productos
export const fetchProducts = async () => {
  const { data, error } = await supabaseAnon
    .from('productos_deprimera')
    .select('*, categoria_nombre:categorias_deprimera(nombre)');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchProductById = async (id) => {
  const { data, error } = await supabaseAnon
    .from('productos_deprimera')
    .select('*, categoria_nombre:categorias_deprimera(nombre)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addProduct = async (nombre, descripcion, precio, categoriaId, imageUrl) => {
  const response = await fetch('/api/productos/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion, precio, categoriaId, imageUrl })
  });

  if (!response.ok) {
    throw new Error('Error al agregar el producto');
  }

  return await response.json();
};

export const updateProduct = async (id, { nombre, descripcion, precio, imageUrl }) => {
  const updates = { nombre, descripcion, precio };
  if (imageUrl) updates.imagen = imageUrl;

  const { error } = await supabaseService
    .from('productos_deprimera')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteProduct = async (id) => {
  const { error } = await supabaseService.from('productos_deprimera').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

// Función para subir una imagen al bucket `imagenes-productos`
export const uploadImage = async (file) => {
  const filePath = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabaseService.storage
    .from('imagenes-productos')
    .upload(filePath, file);

  if (uploadError) throw new Error('Error al subir la imagen: ' + uploadError.message);

  const publicUrl = `${process.env.SUPABASE_BUCKET_URL}/${filePath}`;
  return publicUrl;
};

// Funciones para categorías
export const fetchCategories = async () => {
  const { data, error } = await supabaseAnon
    .from('categorias_deprimera')
    .select('id, nombre');

  if (error) {
    throw new Error('Error al cargar las categorías: ' + error.message);
  }

  return data;
};

export const fetchCategoryById = async (id) => {
  const { data, error } = await supabaseAnon
    .from('categorias_deprimera')
    .select('id, nombre')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addCategory = async (nombre) => {
  const { error } = await supabaseService.from('categorias_deprimera').insert([{ nombre }]);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (id, nombre) => {
  const { error } = await supabaseService
    .from('categorias_deprimera')
    .update({ nombre })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id) => {
  const { error } = await supabaseService.from('categorias_deprimera').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
