import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Define el componente Contacto
export default function Contacto() {
  // Estados para los datos del formulario de contacto
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Estado del contador del carrito, puedes inicializarlo en 0 o en el valor adecuado
  const carritoCount = 0;

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ nombre, email, mensaje }); // Imprime los datos para confirmar
    setEnviado(true);

    // Limpiar el formulario
    setNombre('');
    setEmail('');
    setMensaje('');
  };

  return (
    <div className="bg-[#f9f9f9]">
      {/* Encabezado */}
      <Header carritoCount={carritoCount} />

      {/* Contenido principal de contacto */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#013254] text-center mb-6">Contáctanos</h1>

        {/* Información de contacto */}
        <div className="flex flex-col md:flex-row justify-around items-center bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold text-[#15557b]">De Primera - Mayorista</h2>
            <p className="text-gray-600">Gobernador González 788, B° Constitución, Palpalá, Jujuy</p>
            <p className="text-gray-600">Teléfono: 3884306254</p>
            <p className="text-gray-600">Email: mgurrieri5@gmail.com</p>
            <p className="text-gray-600">Contacto: Marcos Gurrieri</p>
          </div>

          {/* Google Maps */}
          <div className="w-full md:w-1/2 h-64 rounded-lg overflow-hidden shadow-md">
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3637.367378659412!2d-65.2088163!3d-24.2638955!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b0744e665a66d%3A0xe79f5f26a22f918!2sMAO%20Grafica%20y%20Dise%C3%B1o!5e0!3m2!1sen!2sar!4v1729894237934!5m2!1sen!2sar"
  width="100%"
  height="100%"
  frameBorder="0"
  allowFullScreen
  aria-hidden="false"
  tabIndex={-1} // Cambiado a número
  title="Ubicación de Mao Gráfica"
></iframe>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-[#15557b] text-center mb-6">Envíanos un mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-gray-700 font-medium">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#15557b]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#15557b]"
              />
            </div>
            <div>
              <label htmlFor="mensaje" className="block text-gray-700 font-medium">Mensaje</label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#15557b]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FF5B31] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff7f50] transition-colors"
            >
              Enviar mensaje
            </button>
            {enviado && (
              <p className="text-green-600 text-center mt-4 font-medium">
                ¡Gracias por contactarnos! Te responderemos pronto.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Pie de página */}
      <Footer />
    </div>
  );
}
