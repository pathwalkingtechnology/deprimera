import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAnon, supabaseService, uploadImage } from '../../../supabaseClient';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  categoria_id: number | null;
  categoria_nombre: string;
}

const ProductoList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabaseAnon
          .from('productos_deprimera')
          .select('*, categoria_nombre:categorias_deprimera(nombre)');

        if (error) throw error;

        setProductos(data);
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        console.error('Error al cargar productos:', errorMessage);
        setError('Hubo un problema al cargar los productos.');
      }
      setLoading(false);
    };
    loadProductos();
  }, []);

  const handleDeleteProducto = async (id: number) => {
    if (!supabaseService) {
      console.error('El cliente supabaseService no está disponible. Verifica SUPABASE_SERVICE_ROLE_KEY en tu archivo .env.local.');
      alert('Error: No se puede eliminar el producto porque el cliente de Supabase no está configurado.');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await supabaseService.from('productos_deprimera').delete().eq('id', id);
        setProductos(productos.filter((producto) => producto.id !== id));
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        console.error('Error al eliminar el producto:', errorMessage);
        alert(`Error al eliminar el producto: ${errorMessage}`);
      }
    }
  };

  const handleImageUpload = async (producto: Producto) => {
    if (!selectedImage) return;

    try {
      const imageUrl = await uploadImage(selectedImage);
      if (!supabaseService) {
        console.error('El cliente supabaseService no está disponible. Verifica SUPABASE_SERVICE_ROLE_KEY en tu archivo .env.local.');
        alert('Error: No se puede subir la imagen porque el cliente de Supabase no está configurado.');
        return;
      }
      
      await supabaseService.from('productos_deprimera').update({ imagen: imageUrl }).eq('id', producto.id);

      setProductos(productos.map((p) => (p.id === producto.id ? { ...p, imagen: imageUrl } : p)));
      setSelectedImage(null);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error desconocido';
      console.error('Error al subir imagen:', errorMessage);
      setError('No se pudo subir la imagen.');
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <h1>Lista de Productos</h1>
      <Link href="/admin/productos/nuevo">
        <button className="add-btn">Agregar Nuevo Producto</button>
      </Link>

      <ul className="product-list">
        {productos.map((producto) => (
          <li key={producto.id} className="product-item">
            <div className="product-info">
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toFixed(2) : 'No disponible'}</p>
              <p><strong>Categoría:</strong> {producto.categoria_nombre}</p>
              {producto.imagen && (
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={100}
                  height={100}
                  className="product-image"
                />
              )}
            </div>

            <div className="action-buttons">
              <Link href={`/admin/productos/${producto.id}`}>
                <button className="edit-btn">Editar</button>
  </Link>
  <button onClick={() => handleDeleteProducto(producto.id)} className="delete-btn">
    Eliminar
  </button>
  <input
    type="file"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedImage(e.target.files[0]);
      }
    }}
    accept="image/*"
  />
  <button onClick={() => handleImageUpload(producto)} className="upload-btn">
    Subir Imagen
  </button>
</div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ProductoList;
