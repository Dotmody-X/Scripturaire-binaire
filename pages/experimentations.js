import Link from "next/link";
import Image from "next/image";

export default function Experimentations() {
  const projets = [
    {
      id: "bouboule", // ID pour la page dynamique
      titre: "Bouboules Dynamique",
      image: "/images/exp/1.png",
    },
    {
      id: "soundesign", // ID pour la page dynamique
      titre: "Sound Design",
      image: "/images/exp/2.png",
    },
    {
      id: "visuelive",
      titre: "Visuel Live",
      image: "/images/exp/3.png",
    },
    {
      id: "visuevolutif",
      titre: "Visuel Evolutif",
      image: "/images/exp/4.png",
    },
    {
      id: "typodance",
      titre: "Typo Dansante",
      image: "/images/exp/5.png",
    },
    {
      id: "fractal",
      titre: "Fractal Dance",
      image: "/images/exp/6.png",
    },
  ];

  return (
    <div className="container">
      <h1>Mes Expérimentations</h1>
      <p>
        Mes projets de code inspiré ou lié à la musique, avec des projtes
        interactifs liés au son, ou au code génératif.
      </p>
      <div className="grid">
        {projets.map((projet) => (
          <Link
            key={projet.id} // Ajoute cette ligne
            href={`/experimentations/${projet.id}`}
            className="project-card"
          >
            <div>
              <Image
                src={projet.image}
                alt={projet.titre}
                width={320}
                height={180}
                className="project-image"
              />
              <h2>{projet.titre}</h2>
            </div>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .project-card {
          display: block;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
        }

        .project-image {
          object-fit: cover;
          border-radius: 10px;
          width: 100%;
          height: auto;
        }

        h2 {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}
