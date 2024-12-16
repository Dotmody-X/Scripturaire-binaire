import { getAllPostSlugs, getPostData } from "../../lib/posts";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Article.module.css";
import { useEffect } from "react";

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default function Article({ postData }) {
  // Utiliser useEffect pour modifier les liens dynamiquement
  useEffect(() => {
    const links = document.querySelectorAll("article a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  return (
    <div>
      <Head>
        <title>{postData.title}</title>
      </Head>

      {/* Conteneur pour le titre et le fil d'Ariane */}
      <div className={styles.titleContainer}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Accueil</Link>
          {" / "}
          <span>{postData.category}</span>
        </nav>
        <h1 className={styles.articleTitle}>{postData.title}</h1>
      </div>

      {/* Contenu de l'article */}
      <article className={styles.article}>
        {postData.image && (
          <img
            src={postData.image}
            alt={`Illustration pour ${postData.title}`}
            className={styles.articleImage}
          />
        )}

        {/* Conteneur pour la date et l'auteur */}
        <div className={styles.articleInfo}>
          <p className={styles.articleDate}>
            <strong>Fait le </strong> {postData.date}
          </p>
          <p className={styles.articleAuthor}>
            <strong>Par </strong> {postData.author}
          </p>
        </div>

        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
}
