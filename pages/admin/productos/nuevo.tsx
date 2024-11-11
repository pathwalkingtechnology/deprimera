// pages/admin/productos/nuevo.tsx

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { addProduct, uploadImage, fetchCategories } from '../../../supabaseClient';

interface Categoria {
  id: number;
  nombre: string;
}

const NewProduct = () => {
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', (error as Error).message);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (imagen && !['image/jpeg', 'image/png'].includes(imagen.type)) {
        setError('Solo se permiten imágenes en formato JPEG o PNG');
        return;
      }

      let imageUrl: string | null = null;
      if (imagen) {
        const url = await uploadImage(imagen);
        if (!url) {
          setError('Error al subir la imagen');
          return;
        }
        imageUrl = url;
      }

      await addProduct(
        nombre,
        descripcion,
        parseFloat(precio),
        parseInt(categoriaId, 10),
        imageUrl
      );

      setSuccess('Producto agregado exitosamente');
      setTimeout(() => router.push('/admin/productos'), 1000);
    } catch (error) {
      setError('Error al agregar el producto: ' + (error as Error).message);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  return (
    <div className="container">
      <h1>Agregar Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="textarea"
            required
          />
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="select"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id.toString()}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Imagen</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
            className="input-file"
          />
        </div>

        <button type="submit" className="submit-btn">Agregar Producto</button>
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

export default NewProduct;
