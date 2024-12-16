import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  // Détecter si on est sur la page d'accueil ou un article
  const isHomePage = router.pathname === '/';
  const isArticlePage = router.pathname.startsWith('/articles');

  // Ne rien afficher sur la page d'accueil ou dans un article
  if (isHomePage || isArticlePage) {
    return null;
  }

  return (
    <nav>
      <ul>
        <li><Link href="/">Accueil</Link></li>
        <li><Link href="/experimentations">Expérimentations</Link></li>
      </ul>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          background: #333;
          color: white;
        }

        ul {
          list-style: none;
          display: flex;
          gap: 20px;
          padding: 0;
        }

        li a {
          color: white;
          text-decoration: none;
        }

        li a:hover {
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
}
