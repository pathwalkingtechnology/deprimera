import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById, updateProduct, uploadImage, fetchCategories } from '../../../supabaseClient';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  categoria_id: number | null;
}

interface Categoria {
  id: number;
  nombre: string;
}

const EditProduct = () => {
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: null,
    categoria_id: null,
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const product = await fetchProductById(id as string);
          if (product) setProducto(product);
        } catch (error) {
          console.error('Error al cargar producto:', error);
          setError('No se pudo cargar el producto');
        }
      }
    };
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setError('No se pudieron cargar las categorías');
      }
    };
    loadProduct();
    loadCategories();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      let imageUrl = producto.imagen;
      if (imagen) {
        if (!['image/jpeg', 'image/png'].includes(imagen.type)) {
          setError('Solo se permiten imágenes en formato JPEG o PNG');
          return;
        }
        imageUrl = await uploadImage(imagen);
      }

      await updateProduct(producto.id, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: imageUrl,
        categoria_id: producto.categoria_id
      });

      setSuccess('Producto actualizado exitosamente');
      setTimeout(() => router.push('/admin/productos'), 1000);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setError('Error al actualizar el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="container">
      <h1>Editar Producto</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleUpdate} className="form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            className="textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria_id">Categoría:</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={producto.categoria_id || ''}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen:</label>
          <input
            type="file"
            id="imagen"
            accept="image/jpeg, image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImagen(file || null);
            }}
            className="input-file"
          />
        </div>

        <button type="submit" className="submit-btn">Actualizar Producto</button>
      </form>
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
        .input, .textarea {
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

export default EditProduct;
