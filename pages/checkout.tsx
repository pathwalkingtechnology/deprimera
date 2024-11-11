import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Formulario {
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
}

export default function Checkout() {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [formulario, setFormulario] = useState<Formulario>({
    nombre: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    telefono: '',
  });
  const [mensaje, setMensaje] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]') as Producto[];
    setCarrito(carritoGuardado);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formulario).some((campo) => campo === '')) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    const mensajeWhatsApp = `
      ¡Nuevo Pedido!
      Nombre: ${formulario.nombre}
      Dirección: ${formulario.direccion}, ${formulario.ciudad}, ${formulario.provincia}, ${formulario.codigoPostal}
      Teléfono: ${formulario.telefono}
      Productos: ${carrito
        .map((producto) => `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}`)
        .join(', ')}
      Total: $${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
    `;

    const numeroEmpresa = '5493884306254';
    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    window.location.href = urlWhatsApp;

    setFormulario({
      nombre: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      telefono: '',
    });
    localStorage.removeItem('carrito');

    setMensaje('¡Pedido realizado exitosamente!');
    setTimeout(() => {
      setMensaje(null); 
      router.push('/confirmacion');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        {/* Aquí se incluyen los campos del formulario */}
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Realizar Pedido
        </button>
      </form>
      {mensaje && <p className="text-red-500 mt-4">{mensaje}</p>}
    </div>
  );
}
