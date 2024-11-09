import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts, deleteProduct } from '../../../supabaseClient';

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

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        // Casting error a tipo Error para acceder a .message
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
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error desconocido';
        console.error('Error al eliminar producto:', errorMessage);
        setError('No se pudo eliminar el producto.');
      }
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
