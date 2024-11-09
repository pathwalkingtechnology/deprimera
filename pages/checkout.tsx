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
  const [mensaje, setMensaje] = useState<string | null>(null); // Estado para el mensaje de error o éxito
  const router = useRouter();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]') as Producto[];
    setCarrito(carritoGuardado);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica que todos los campos estén completos
    if (Object.values(formulario).some((campo) => campo === '')) {
      setMensaje('Por favor completa todos los campos');
      return;
    }

    const mensajeWhatsApp = `
      ¡Nuevo Pedido!
      Nombre: ${formulario.nombre}
      Dirección: ${formulario.direccion}, ${formulario.ciudad}, ${formulario.provincia}, ${formulario.codigoPostal}
      Teléfono: ${formulario.telefono}
      Productos: ${carrito.map((producto) => `${producto.nombre} x${producto.cantidad}`).join(', ')}
      Total: $${carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
    `;

    const numeroEmpresa = '5493884306254';
    const urlWhatsApp = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Redirige a WhatsApp
    window.location.href = urlWhatsApp;

    // Limpia el formulario y el carrito
    setFormulario({
      nombre: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      telefono: '',
    });
    localStorage.removeItem('carrito');

    // Actualiza el mensaje de éxito
    setMensaje('¡Pedido realizado exitosamente!');
    // Redirige a la página de confirmación después de unos segundos
    setTimeout(() => {
      setMensaje(null); // Limpia el mensaje antes de redirigir
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
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formulario.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={formulario.ciudad}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formulario.provincia}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="codigoPostal"
          placeholder="Código Postal"
          value={formulario.codigoPostal}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formulario.telefono}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Realizar Pedido
        </button>
      </form>
      {mensaje && <p className="text-red-500 mt-4">{mensaje}</p>}
    </div>
  );
}
