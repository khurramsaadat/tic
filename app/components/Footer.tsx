'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { FaXTwitter, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa6';
import { MdComputer } from 'react-icons/md';
import { FaBrain, FaUserFriends } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h3>NAVIGATION</h3>
          <Link 
            href="/2-players"
            aria-current={pathname === '/2-players' ? 'page' : undefined}
            className={styles.navLink}
          >
            <FaUserFriends className={styles.navIcon} />
            <span>2 PLAYERS</span>
          </Link>
          <Link 
            href="/2-players-pro"
            aria-current={pathname === '/2-players-pro' ? 'page' : undefined}
            className={styles.navLink}
          >
            <GiPerspectiveDiceSixFacesRandom className={styles.navIcon} />
            <span>2 PLAYERS PRO</span>
          </Link>
          <Link 
            href="/play-with-system"
            aria-current={pathname === '/play-with-system' ? 'page' : undefined}
            className={styles.navLink}
          >
            <MdComputer className={styles.navIcon} />
            <span>PLAY WITH SYSTEM</span>
          </Link>
          <Link 
            href="/ai-learning"
            aria-current={pathname === '/ai-learning' ? 'page' : undefined}
            className={styles.navLink}
          >
            <FaBrain className={styles.navIcon} />
            <span>AI BUDDY</span>
          </Link>
          <Link 
            href="/instructions"
            aria-current={pathname === '/instructions' ? 'page' : undefined}
            className={styles.navLink}
          >
            <IoInformationCircleOutline className={styles.navIcon} />
            <span>HELP</span>
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