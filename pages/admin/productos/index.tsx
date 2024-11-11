import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAnon, supabaseService, uploadImage } from '../../../supabaseClient';


interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria_nombre: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabaseAnon
          .from('productos_deprimera')
          .select('*, categoria_nombre:categorias_deprimera(nombre)');

        if (error) throw error;

        setProducts(data);
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        console.error('Error al cargar productos:', errorMessage);
        setError('Hubo un problema al cargar los productos.');
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await supabaseService.from('productos_deprimera').delete().eq('id', id);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        console.error('Error al eliminar producto:', errorMessage);
        setError('No se pudo eliminar el producto.');
      }
    }
  };

  const handleImageUpload = async (product: Product) => {
    if (!selectedImage) return;

    try {
      const imageUrl = await uploadImage(selectedImage);
      await supabaseService.from('productos_deprimera').update({ imagen: imageUrl }).eq('id', product.id);

      setProducts(products.map((p) => (p.id === product.id ? { ...p, imagen: imageUrl } : p)));
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
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-info">
              <p><strong>Nombre:</strong> {product.nombre}</p>
              <p><strong>Descripción:</strong> {product.descripcion}</p>
              <p><strong>Precio:</strong> ${product.precio ? product.precio.toFixed(2) : 'No disponible'}</p>
              <p><strong>Categoría:</strong> {product.categoria_nombre}</p>
              {product.imagen && (
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  width={100}
                  height={100}
                  className="product-image"
                />
              )}
            </div>

            <div className="action-buttons">
              <Link href={`/admin/productos/${product.id}`}>
                <button className="edit-btn">Editar</button>
              </Link>
              <button onClick={() => handleDelete(product.id)} className="delete-btn">
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
              <button onClick={() => handleImageUpload(product)} className="upload-btn">
                Subir Imagen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
