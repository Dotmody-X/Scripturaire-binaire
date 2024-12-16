let song;
let fft;
let time = 0;
let palettes;
let currentPaletteIndex = 0;
let oscillationSpeed = 0.01;
let oscillationAmplitude = 20;

function preload() {
  song = loadSound("Dreams.mp3", () => console.log("Musique chargée !"), err => console.error("Erreur :", err));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  palettes = [
    [color(200, 50, 100), color(50, 150, 200), color(100, 200, 150), color(255, 200, 50)],
    [color(255, 100, 100), color(100, 255, 150), color(50, 150, 255), color(200, 50, 255)],
    [color(50, 200, 100), color(200, 100, 50), color(100, 50, 200), color(255, 255, 50)],
  ];

  fft = new p5.FFT();
  fft.setInput(song);
}

function draw() {
  background(20, 20, 45, 10);

  let spectrum = fft.analyze();
  let subBass = fft.getEnergy(20, 60);
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  time += oscillationSpeed;

  let palette = palettes[currentPaletteIndex];

  drawEvolvingCircle(width / 5, height / 2, subBass, time, palette[0]);
  drawEvolvingCircle(width / 3, height / 2, bass, time + 1, palette[1]);
  drawEvolvingCircle(width / 2, height / 2, mid, time + 2, palette[2]);
  drawEvolvingCircle((3 * width) / 4, height / 2, treble, time + 3, palette[3]);
}

function drawEvolvingCircle(x, y, energy, timeOffset, baseColor) {
  push();
  translate(x, y);

  let radius = map(energy, 2, 220, 40, width / 4);
  let oscillation = sin(time + timeOffset) * oscillationAmplitude;
  let dynamicRadius = radius + oscillation;

  let evolvingColor = lerpColor(baseColor, color(255, 255, 255), abs(sin(time + timeOffset)));

  noFill();
  stroke(evolvingColor);
  strokeWeight(3);

  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.008) {
    let offset = map(noise(cos(angle + time), sin(angle + timeOffset)), 0, 1, -30, 10);
    let r = dynamicRadius + offset;
    let xPos = r * cos(angle);
    let yPos = r * sin(angle);
    vertex(xPos, yPos);
  }
  endShape(CLOSE);

  pop();
}

function keyPressed(event) {
  // Espace pour démarrer ou mettre en pause la musique
  if (key === " " || keyCode === 32) {
    userStartAudio(); // Nécessaire pour initialiser l’audio sur les navigateurs modernes
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  }

  // Changer la palette avec "p"
  if (key === "p" || key === "P") {
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
  }

  // Modifier la vitesse des oscillations avec les flèches
  if (keyCode === UP_ARROW) {
    event.preventDefault(); // Empêche la page de défiler
    oscillationSpeed += 0.001;
  } else if (keyCode === DOWN_ARROW) {
    event.preventDefault(); // Empêche la page de défiler
    oscillationSpeed = max(0.001, oscillationSpeed - 0.001);
  }

  // Modifier l'amplitude avec "+" et "-"
  if (key === "+") {
    oscillationAmplitude += 5;
  } else if (key === "-") {
    oscillationAmplitude = max(5, oscillationAmplitude - 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

