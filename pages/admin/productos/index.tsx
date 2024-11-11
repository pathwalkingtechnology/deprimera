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
}

const ProductoList = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabaseAnon
          .from('productos_deprimera')
          .select('*, categoria_id');

        if (error) throw error;
        setProductos(data);
      } catch (error) {
        setError('Hubo un problema al cargar los productos.');
      }
      setLoading(false);
    };
    loadProductos();
  }, []);

  const handleDeleteProducto = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await supabaseService.from('productos_deprimera').delete().eq('id', id);
        setProductos(productos.filter((producto) => producto.id !== id));
      } catch (error) {
        alert(`Error al eliminar el producto: ${error.message}`);
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
        {productos.map((producto) => (
          <li key={producto.id} className="product-item">
            <div className="product-info">
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Precio:</strong> ${producto.precio.toFixed(2)}</p>
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
              <button onClick={() => handleDeleteProducto(producto.id)} className="delete-btn">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
       <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .error {
          color: #ff434d;
          text-align: center;
          margin-bottom: 10px;
        }
        .success {
          color: #00afef;
          text-align: center;
          margin-bottom: 10px;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #2a4760;
        }
        .input, .select, .textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .input-file {
          width: 100%;
        }
        .submit-btn {
          padding: 10px;
          background-color: #00afef;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: #008fc9;
        }
      `}</style>
    </div>
  );
};

export default ProductoList;
