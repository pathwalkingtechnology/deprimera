import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son obligatorias.');
}

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export { supabaseAnon, supabaseService };

// Funciones de productos y categorías ajustadas para JavaScript

export const fetchProducts = async () => {
  const response = await fetch('/api/productos/read');
  if (!response.ok) throw new Error('Error al cargar los productos');
  return await response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`/api/productos/read?id=${id}`);
  if (!response.ok) throw new Error('Error al cargar el producto');
  return await response.json();
};

export const addProduct = async (nombre, descripcion, precio, categoriaId, imageUrl) => {
  const response = await fetch('/api/productos/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion, precio, categoriaId, imageUrl })
  });

  if (!response.ok) throw new Error('Error al agregar el producto');
  return await response.json();
};

export const updateProduct = async (id, updates) => {
  const response = await fetch('/api/productos/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates })
  });

  if (!response.ok) throw new Error('Error al actualizar el producto');
};

export const deleteProduct = async (id) => {
  const response = await fetch('/api/productos/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!response.ok) throw new Error('Error al eliminar el producto');
};

export const uploadImage = async (file) => {
  const filePath = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabaseService.storage
    .from('imagenes-productos')
    .upload(filePath, file);

  if (uploadError) throw new Error('Error al subir la imagen: ' + uploadError.message);

  const publicUrl = `${process.env.SUPABASE_BUCKET_URL}/${filePath}`;
  return publicUrl;
};

export const fetchCategories = async () => {
  const response = await fetch('/api/categorias/read');
  if (!response.ok) throw new Error('Error al cargar las categorías');
  return await response.json();
};

export const fetchCategoryById = async (id) => {
  const response = await fetch(`/api/categorias/read?id=${id}`);
  if (!response.ok) throw new Error('Error al cargar la categoría');
  return await response.json();
};

export const addCategory = async (nombre) => {
  const response = await fetch('/api/categorias/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });

  if (!response.ok) throw new Error('Error al agregar la categoría');
};

export const updateCategory = async (id, nombre) => {
  const response = await fetch('/api/categorias/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nombre })
  });

  if (!response.ok) throw new Error('Error al actualizar la categoría');
};

export const deleteCategory = async (id) => {
  const response = await fetch('/api/categorias/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (!response.ok) throw new Error('Error al eliminar la categoría');
};
