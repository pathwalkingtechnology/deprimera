import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';

export default function Confirmacion() {
  const router = useRouter();
  const [contador, setContador] = useState(10);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setContador((prevContador) => {
        if (prevContador > 1) {
          return prevContador - 1;
        } else {
          clearInterval(intervalId);
          router.push('/');
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center">
      <Header2 />
      <h1 className="text-2xl font-bold mb-4">¡Gracias por tu pedido!</h1>
      <p className="text-lg">Tu pedido ha sido enviado correctamente. Nos pondremos en contacto contigo en breve.</p>
      <p className="text-lg">Redirigiendo a la página principal en {contador} segundos...</p>
      <progress className="progress w-56" value={contador} max="10"></progress>
      <Footer />
    </div>
  );
}
