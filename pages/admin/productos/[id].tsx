import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById, updateProduct, uploadImage } from '../../../supabaseClient';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  categoria_id: number | null;
  categoria_nombre: { nombre: string };
}

const EditProduct = () => {
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: null,
    categoria_id: null,
    categoria_nombre: { nombre: '' },
  });
  const [imagen, setImagen] = useState<File | null>(null);
  // @ts-nocheck
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const product = await fetchProductById(id);
          if (product) {
            setProducto(product);
          } else {
            setError('Producto no encontrado');
          }
        } catch (error) {
          setError('Error al cargar producto');
        }
      };
      loadProduct();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = null;
      if (imagen) {
        if (!['image/jpeg', 'image/png'].includes(imagen.type)) {
          setError('Solo se permiten imágenes en formato JPEG o PNG');
          return;
        }
        imageUrl = await uploadImage(imagen);
      }

      await updateProduct(id, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: imageUrl,
      });
      setSuccess('Producto actualizado exitosamente');
      
      setTimeout(() => router.push('/admin/productos'), 1000);
    } catch (error) {
      setError(`Error al actualizar el producto: ${error.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
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
          <label htmlFor="imagen">Imagen:</label>
          <input
            type="file"
            id="imagen"
            accept="image/jpeg, image/png"
            onChange={(e) => setImagen(e.target.files[0])}
            className="input-file"
          />
        </div>

        <button type="submit" className="submit-btn">Actualizar Producto</button>
      </form>
    
    </div>
  );
};

export default EditProduct;
