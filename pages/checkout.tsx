// /pages/checkout.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';

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

    // Verificación de que todos los campos están completos
    if (Object.values(formulario).some((campo) => campo === '')) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    // Crear el mensaje de WhatsApp
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

    // Redirigir a WhatsApp
    const numeroEmpresa = '5493884306254';
    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.location.href = urlWhatsApp;

    // Limpiar el formulario y el carrito
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

  // Control de cambio en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({ ...prevFormulario, [name]: value }));
  };

  return (
    <div>
      <Header2 />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="direccion"
            value={formulario.direccion}
            onChange={handleInputChange}
            placeholder="Dirección"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="ciudad"
            value={formulario.ciudad}
            onChange={handleInputChange}
            placeholder="Ciudad"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="provincia"
            value={formulario.provincia}
            onChange={handleInputChange}
            placeholder="Provincia"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="codigoPostal"
            value={formulario.codigoPostal}
            onChange={handleInputChange}
            placeholder="Código Postal"
            className="border p-2 mb-4 w-full"
          />
          <input
            type="text"
            name="telefono"
            value={formulario.telefono}
            onChange={handleInputChange}
            placeholder="Teléfono"
            className="border p-2 mb-4 w-full"
          />

          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Realizar Pedido
          </button>
        </form>
        {mensaje && <p className="text-red-500 mt-4">{mensaje}</p>}
      </div>
      <Footer />
    </div>
  );
}
