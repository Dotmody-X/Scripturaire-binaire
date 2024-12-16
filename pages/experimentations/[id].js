import { useRouter } from 'next/router';

export default function Projet() {
  const router = useRouter();
  const { id } = router.query;

  // Liste des projets
  const projets = {
    bouboule: {
      titre: 'Bouboules Dynamique',
      description: 'Projet qui fait bouger aléatoirement des boules.',
      script: '/bouboule/index.html', // Chemin vers ton fichier HTML
    },
    soundesign: {
      titre: 'Sound Design',
      description: 'Un projet explorant les liens entre musique et visuel.',
      script: '/soundesign/index.html', // Chemin vers ton fichier HTML
    },
    visuelive: {
      titre: 'Visuel Live',
      description: 'Projet qui dessine des courbe sonore en fonction de l environement.',
      script: '/visuelive/index.html', // Chemin vers ton fichier HTML
    },
    visuevolutif: {
      titre: 'Visuel Evolutif',
      description: 'Visuel complètement personalisable',
      script: '/visuevolutif/index.html', // Chemin vers ton fichier HTML
    },
    typodance: {
      titre: 'Typo Dansante',
      description: 'Mot personalisable au mouvement de la musique',
      script: '/typodance/index.html', // Chemin vers ton fichier HTML
    },
    fractal: {
      titre: 'Fractal Dance',
      description: 'Fractale au mouvement de la musique',
      script: '/fractal/index.html', // Chemin vers ton fichier HTML
    },
  };

  // Si `id` est undefined ou invalide
  if (!id || !projets[id]) {
    return <p>Projet introuvable.</p>;
  }

  const projet = projets[id];

  return (
    <div className="container">
      <h1>{projet.titre}</h1>
      <p>{projet.description}</p>

      {/* Intégration du projet via iframe */}
      {projet.script && (
        <iframe
          src={projet.script}
          style={{
            width: '100%',
            height: '500px',
            border: 'none',
          }}
        ></iframe>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        iframe {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
