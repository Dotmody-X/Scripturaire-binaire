import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";


const contentDirectory = path.join(process.cwd(), "content");

// Récupère les données triées des articles
export function getSortedPostsData() {
  const fileNames = fs.readdirSync(contentDirectory);

  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data,
      content,
    };
  });

  return allPostsData.sort((a, b) => {
    // Convertir les dates au format 'DD-MM-YYYY' en objets Date
    const dateA = new Date(a.date.split("-").reverse().join("-"));
    const dateB = new Date(b.date.split("-").reverse().join("-"));

    // Trier les articles par date décroissante (du plus récent au plus ancien)
    return dateB - dateA;
  });
}


// Récupère tous les slugs des articles
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ""),
    },
  }));
}

// Récupère les données complètes d’un article spécifique
export async function getPostData(slug) {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Utilise gray-matter pour parser les métadonnées et le contenu
  const { data, content } = matter(fileContents);

  // Convertit le contenu Markdown en HTML
  const processedContent = await remark().use(html, { sanitize: false}).process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    ...data,
    contentHtml,
  };
}
