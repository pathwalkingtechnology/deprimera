import Image from "next/image";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  categoria_id: number;
  categoria_nombre: string;
}

interface Props {
  productos: Producto[];
}

export async function getServerSideProps() {
  const { data: productos, error: errorProductos } = await supabase
    .from('productos_deprimera')
    .select('*, categoria_nombre:categorias_deprimera(nombre)');

  const { data: categorias, error: errorCategorias } = await supabase
    .from('categorias_deprimera')
    .select('*');

  if (errorProductos || errorCategorias) {
    console.error(errorProductos || errorCategorias);
    return { props: { productos: [] } };
  }

  // Comprobación para asegurarse de que categorias.data no sea null
  if (!categorias) {
    return { props: { productos: [] } };
  }

  const productosConCategoria = productos.map((producto) => {
    const categoria = categorias.find((categoria) => categoria.id === producto.categoria_id);
    return { ...producto, categoria_nombre: categoria?.nombre || 'Categoría no encontrada' };
  });

  return {
    props: { productos: productosConCategoria },
  };
}

export default function Home({ productos }: Props) {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);

  useEffect(() => {
    const resultados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductosFiltrados(resultados);
  }, [busqueda, productos]);

  const agregarAlCarrito = (producto: Producto) => {
    const nuevoCarrito = [...carrito, producto];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  return (
    <div className="bg-[#f9f9f9]">
      <Header carritoCount={carrito.length} />

      {/* Hero Banner */}
      <Link href="/contacto">
        <section
          style={{ backgroundImage: "url('/banner_promo.jpg')" }}
          className="hero-banner hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="container mx-auto px-4 py-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full p-4 text-lg border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#013254]"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#013254] text-center">
          Bienvenidos a De Primera Mayorista
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <li key={producto.id} className="border p-4 rounded-lg shadow-lg bg-white">
              <Image
  src={producto.imagen}
  alt={producto.nombre}
  width={400}
  height={300}
/>
              <h2 className="text-2xl font-semibold text-[#15557b]">
                {producto.nombre}
              </h2>
              <p className="text-gray-600 mb-2">{producto.descripcion}</p>
              <p className="text-lg font-bold text-[#FF5B31]">
                $ {producto.precio.toFixed(2)}
              </p>
              <p className="text-md text-gray-600">
                Categoría: {producto.categoria_nombre}
              </p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="mt-4 bg-[#013254] text-white px-4 py-2 rounded-lg hover:bg-[#15557b] transition-colors"
              >
                Agregar al carrito
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
}
