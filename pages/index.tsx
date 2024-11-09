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
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*, categoria_nombre:categorias(nombre)')
    .join('categorias', 'id', 'categoria_id');

  if (error) {
    console.error(error);
    return { props: { productos: [] } };
  }

  return {
    props: { productos },
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
          style={{ backgroundImage: "url('/promomao.avif')" }}
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
  className="w-full h-48 object-cover mb-4 rounded-lg"
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
