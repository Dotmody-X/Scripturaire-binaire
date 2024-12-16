// Récupérer les éléments
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('audio');
const startButton = document.querySelector('.start-button');

// Ajuster la taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration audio
let audioContext, analyser, dataArray;

// Configuration de la fractale
const MAX_ITERATIONS = 300;
const zoomFactor = { value: 200 }; // Zoom ajustable
let cx = -0.7; // Paramètre c (partie réelle)
let cy = 0.27015; // Paramètre c (partie imaginaire)

// Initialiser l'audio
function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

// Générer une couleur réactive en fonction de l'audio
function getColor(iteration, maxIteration, audioValue) {
    const t = iteration / maxIteration + audioValue / 512;
    const r = Math.floor(9 * (1 - t) * t * t * t * 255);
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

// Dessiner la fractale
function drawFractal(audioValue) {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = imgData.data;

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let zx = (x - canvas.width / 2) / zoomFactor.value;
            let zy = (y - canvas.height / 2) / zoomFactor.value;
            let iteration = 0;

            while (zx * zx + zy * zy < 4 && iteration < MAX_ITERATIONS) {
                const xtemp = zx * zx - zy * zy + cx + Math.sin(audioValue / 100) * 0.01;
                zy = 2 * zx * zy + cy + Math.cos(audioValue / 100) * 0.01;
                zx = xtemp;
                iteration++;
            }

            const pixelIndex = (y * canvas.width + x) * 4;
            if (iteration === MAX_ITERATIONS) {
                data[pixelIndex] = 0; // R
                data[pixelIndex + 1] = 0; // G
                data[pixelIndex + 2] = 0; // B
                data[pixelIndex + 3] = 255; // Alpha
            } else {
                const color = getColor(iteration, MAX_ITERATIONS, audioValue);
                const [r, g, b] = color.match(/\d+/g).map(Number);
                data[pixelIndex] = r; // R
                data[pixelIndex + 1] = g; // G
                data[pixelIndex + 2] = b; // B
                data[pixelIndex + 3] = 255; // Alpha
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Animation
function animate() {
    analyser.getByteFrequencyData(dataArray);
    const audioValue = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    cx = -0.7 + Math.sin(audioValue / 300) * 0.2; // Modifier la position c en fonction de la musique
    cy = 0.27015 + Math.cos(audioValue / 300) * 0.2;

    zoomFactor.value += Math.sin(audioValue / 200) * 0.5; // Variation du zoom
    drawFractal(audioValue);
    requestAnimationFrame(animate);
}

// Démarrer la musique et l'animation
startButton.addEventListener('click', () => {
    setupAudio();
    audio.play();
    animate();
    startButton.style.display = 'none';
});
