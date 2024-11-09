import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente anónimo para operaciones regulares
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Cliente de rol de servicio para operaciones protegidas
const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey);

// Funciones para productos
export const fetchProducts = async () => {
  const { data, error } = await supabaseAnon
    .from('productos')
    .select('id, nombre, descripcion, precio, categoria_id, imagen');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchProductById = async (id) => {
  const { data, error } = await supabaseAnon
    .from('productos')
    .select('id, nombre, descripcion, precio, categoria_id, imagen')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addProduct = async (nombre, descripcion, precio, categoriaId, imageUrl) => {
  const { data, error } = await supabaseService
    .from('productos')
    .insert([{ nombre, descripcion, precio, categoria_id: categoriaId, imagen: imageUrl }]);

  if (error) {
    throw new Error('Error al agregar el producto: ' + error.message);
  }

  return data;
};

export const updateProduct = async (id, { nombre, descripcion, precio, imageUrl }) => {
  const updates = { nombre, descripcion, precio };
  if (imageUrl) updates.imagen = imageUrl;

  const { error } = await supabaseService
    .from('productos')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteProduct = async (id) => {
  const { error } = await supabaseService.from('productos').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

// Función para subir una imagen al bucket `product-images`
export const uploadImage = async (file) => {
  const filePath = `${Date.now()}_${file.name}`;
  const { data, error } = await supabaseService.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) {
    throw new Error('Error al subir la imagen: ' + error.message);
  }

  const { data: publicData } = supabaseService.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicData.publicUrl;
};

// Funciones para categorías
export const fetchCategories = async () => {
  const { data, error } = await supabaseAnon
    .from('categorias')
    .select('id, nombre');

  if (error) {
    throw new Error('Error al cargar las categorías: ' + error.message);
  }

  return data;
};

export const fetchCategoryById = async (id) => {
  const { data, error } = await supabaseAnon
    .from('categorias')
    .select('id, nombre')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addCategory = async (nombre) => {
  const { error } = await supabaseService.from('categorias').insert([{ nombre }]);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (id, nombre) => {
  const { error } = await supabaseService
    .from('categorias')
    .update({ nombre })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id) => {
  const { error } = await supabaseService.from('categorias').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
