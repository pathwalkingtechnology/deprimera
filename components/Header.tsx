import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

interface HeaderProps {
  carritoCount: number;
}

export default function Header({ carritoCount }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={190} height={80} className={styles.logo} />
        </Link>

        {/* Botón de Contacto */}
        <Link href="/contacto" className={styles.contactLink}>
          <Image src="/contacto.png" alt="Contacto" width={50} height={50} className={styles.contactIcon} />
        </Link>

        {/* Carrito */}
        <Link href="/carrito" className={styles.cartLink}>
          <div className={styles.cartContainer}>
            <Image src="/cart-icon.svg" alt="Carrito" width={24} height={24} className={styles.cartIcon} />
            <span className={styles.cartText}>Carro</span>
            <div className={styles.cartCount}>
              {carritoCount}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
