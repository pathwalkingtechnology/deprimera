import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function Checkout() {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]') as Producto[];
    setCarrito(carritoGuardado);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mensajeWhatsApp = `
      ¡Nuevo Pedido!
      Nombre: ${nombre}
      Dirección: ${direccion}, ${ciudad}, ${provincia}, ${codigoPostal}
      Teléfono: ${telefono}
      Productos: ${carrito.map((producto) => `${producto.nombre} x${producto.cantidad}`).join(', ')}
      Total: $${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
    `;

    const numeroEmpresa = '5493884072024';
    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Redirige a WhatsApp
    window.location.href = urlWhatsApp;

    // Limpia el formulario y el carrito
    setNombre('');
    setDireccion('');
    setCiudad('');
    setProvincia('');
    setCodigoPostal('');
    setTelefono('');
    localStorage.removeItem('carrito');

    // Redirige a la página de confirmación
    router.push('/confirmacion');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código Postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Realizar Pedido
        </button>
      </form>
      {mensaje && <p className="text-red-500">{mensaje}</p>}
    </div>
  );
}
