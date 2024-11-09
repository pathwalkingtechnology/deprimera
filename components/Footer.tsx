import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}> 2024 Mao Store. Todos los derechos reservados.</p>
        <a
          href="https://pathweb.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.signature}
        >
          <Image src="/firma.png" alt="Firma" width={90} height={40} className={styles.image} />
        </a>
      </div>
    </footer>
  );
}
