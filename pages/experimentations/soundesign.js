import { useEffect } from 'react';

export default function SoundDesign() {
  useEffect(() => {
    // Intégrer la version HTML dans un iframe
    const iframe = document.createElement('iframe');
    iframe.src = '/soundesign/index.html'; // Chemin vers ton projet
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';

    const container = document.getElementById('iframe-container');
    container.appendChild(iframe);

    return () => {
      container.removeChild(iframe); // Nettoyage à la sortie
    };
  }, []);

  return (
    <div>
      <h1>Sound Design</h1>
      <div id="iframe-container" />
    </div>
  );
}
