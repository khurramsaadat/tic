'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { FaXTwitter, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa6';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>NAVIGATION</h3>
          <Link 
            href="/play-with-system"
            aria-current={pathname === '/play-with-system' ? 'page' : undefined}
          >
            PLAY WITH AI
          </Link>
          <Link 
            href="/2-players"
            aria-current={pathname === '/2-players' ? 'page' : undefined}
          >
            2 PLAYERS
          </Link>
          <Link 
            href="/2-players-plus"
            aria-current={pathname === '/2-players-plus' ? 'page' : undefined}
          >
            2 PLAYERS+
          </Link>
          <Link 
            href="/instructions"
            aria-current={pathname === '/instructions' ? 'page' : undefined}
          >
            INSTRUCTIONS
          </Link>
        </div>
        
        <div className={styles.section}>
          <h3>CONNECT</h3>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Tic Tac Toe. All rights reserved.</p>
      </div>
    </footer>
  );
} 