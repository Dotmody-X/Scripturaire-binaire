import Link from "next/link"; // Import du composant Link de Next.js
import { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { getSortedPostsData } from "../lib/posts";

// Fonction pour récupérer les données des articles
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

// Composant principal de la page d'accueil
export default function Home({ allPostsData }) {
  const [selectedCategory, setSelectedCategory] = useState("all"); // Catégorie sélectionnée
  const [searchQuery, setSearchQuery] = useState(""); // Texte de recherche

  // Gestion du filtrage par catégorie
  const filteredPosts = allPostsData.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Scripturaire-Binaire</title>
        <meta
          name="description"
          content="Un blog sur l'art génératif et la création par le code"
        />
      </Head>

      {/* Header avec le logo et la barre de recherche */}
      <header className={styles.header}>
        <h1 className={styles.title}>Scripturaire-01</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Rechercher..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Section Catégories */}
          <aside className={styles.categories}>
            <h3>Catégories</h3>
            <div className={styles.underline}></div>
            <ul>
              {[
                "all",
                "algorithmes créatifs",
                "art génératif",
                "audioVisuel & génératif",
                "code & esthétique",
                "créations intéractives",
                "données & visualisation",
                "expositions & évènements",
                "ia & art",
                "outils & technologies",
                "portraits d'artistes",
                "ressources & inspirations",
              ].map((category) => (
                <li
                  key={category}
                  className={
                    selectedCategory === category ? styles.activeCategory : ""
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
              {/* Ajoute le lien pour Expérimentations */}
              <li>
                <Link href="/experimentations">Visuel des expérimentations</Link>
              </li>
            </ul>
          </aside>

          {/* Section Articles */}
          <section className={styles.articlesSection}>
            <h2>Articles récents</h2>
            <div className={styles.underline}></div>
            <ul className={styles.articlesList}>
              {filteredPosts.map(({ slug, title, date, excerpt, image }) => (
                <li key={slug} className={styles.article}>
                  <Link href={`/articles/${slug}`}>
                    {image && (
                      <img
                        src={image}
                        alt={`Image de ${title}`}
                        className={styles.articleImage}
                        loading="lazy"
                      />
                    )}
                    <h3>{title}</h3>
                    <small>{date}</small>
                    <p>{excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
