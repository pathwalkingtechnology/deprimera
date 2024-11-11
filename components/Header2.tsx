import Link from 'next/link';
import Image from 'next/image';
import styles from './Header2.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={190} height={80} className={styles.logo} />
        </Link>

        {/* Botón de Contacto */}
        <Link href="/contacto" className={styles.contactLink}>
          <Image src="/contacto2.png" alt="Contacto" width={50} height={50} className={styles.contactIcon} />
        </Link>

      </div>
    </header>
  );
}
