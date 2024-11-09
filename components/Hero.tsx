import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <Link href="/contacto">
      <section
        className={styles.hero}
        style={{
          backgroundImage: "url('/promomao.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto text-center px-4 h-full flex justify-center items-center">
          {/* Espacio vacío para centrado visual */}
        </div>
      </section>
    </Link>
  );
}
