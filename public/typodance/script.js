let song;
let fft;
let words = ["SALAMANDER", "DOTMODY.X", "LOVER", "DREAMS"];
let currentWord = 0;
let letters = [];
let fontSize = 50;

// Variables pour la synchronisation
let bpm = 130; // BPM de la musique
let beatsPerMeasure = 4; // Nombre de temps par mesure
let intervalPerMeasure; // Intervalle pour 1 mesure
let intervalPerFourMeasures; // Intervalle pour 4 mesures
let startTime = null; // Moment où la musique a été démarrée
let currentMeasure = 0; // Mesure actuelle

function preload() {
  song = loadSound("Dreams.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textAlign(CENTER, CENTER);
  fft = new p5.FFT();
  fft.setInput(song);

  // Calcul dynamique des intervalles
  let secondsPerBeat = 60 / bpm;
  let secondsPerMeasure = secondsPerBeat * beatsPerMeasure;
  intervalPerMeasure = secondsPerMeasure * 1000; // En millisecondes
  intervalPerFourMeasures = secondsPerMeasure * 4 * 1000; // 4 mesures

  // Initialisation des lettres
  createLetters(words[currentWord]);
}

function draw() {
  background(10, 10, 30, 50);

  // Analyse des fréquences sonores
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // Vérifie le temps écoulé et la mesure actuelle
  if (startTime !== null) {
    let elapsedTime = millis() - startTime;

    // Calcule la mesure actuelle (en commençant à 0)
    currentMeasure = Math.floor(elapsedTime / intervalPerMeasure);

    // Vérifie si c'est le moment de changer le mot
    if (
      (currentMeasure < 8 && elapsedTime % intervalPerMeasure < 50) || // Change chaque mesure dans les 8 premières
      (currentMeasure >= 8 && elapsedTime % intervalPerFourMeasures < 50) // Change toutes les 4 mesures après
    ) {
      currentWord = (currentWord + 1) % words.length;
      createLetters(words[currentWord]);
    }
  }

  // Mise à jour et affichage des lettres
  letters.forEach((letter, index) => {
    let energy;
    if (index % 3 === 0) energy = bass;
    else if (index % 3 === 1) energy = mid;
    else energy = treble;

    letter.update(energy);
    letter.display();
  });
}

function keyPressed() {
  // Barre d'espace pour démarrer ou mettre en pause la musique
  if (key === " " || keyCode === 32) {
    userStartAudio();
    if (song.isPlaying()) {
      song.pause();
      startTime = null; // Met le décompte en pause
    } else {
      song.play();
      if (startTime === null) {
        startTime = millis(); // Synchronise le décompte avec le démarrage de la musique
      }
    }
  }
  if (key === "n" || key === "N") {
    let newWord = prompt("Entrez un nouveau mot ou phrase:");
    if (newWord) {
      words.push(newWord.toUpperCase());
    }
  }
  // Supprimer une phrase (touche "D")
  if (key === "d" || key === "D") {
    let phraseToDelete = prompt("Entrez le mot ou la phrase à supprimer :");
    if (phraseToDelete) {
      // Supprime la phrase si elle est trouvée
      let index = words.indexOf(phraseToDelete.toUpperCase());
      if (index !== -1) {
        words.splice(index, 1); // Supprime la phrase
        alert(`La phrase "${phraseToDelete}" a été supprimée.`);
      } else {
        alert(`La phrase "${phraseToDelete}" n'a pas été trouvée.`);
      }
    }
  }
  // Afficher toutes les phrases (touche "L")
  if (key === "l" || key === "L") {
    if (words.length > 0) {
      alert("Phrases actuelles :\n" + words.join("\n"));
    } else {
      alert("Aucune phrase n'est actuellement enregistrée.");
    }
  }
}

function createLetters(word) {
  letters = [];
  let xStep = width / (word.length + 1); // Espacement horizontal
  for (let i = 0; i < word.length; i++) {
    let x = xStep * (i + 1);
    let y = height / 2;
    letters.push(new Letter(word[i], x, y));
  }
}

class Letter {
  constructor(char, x, y) {
    this.char = char;
    this.baseX = x; 
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.size = fontSize;
    this.rotation = 0;
    this.opacity = 255;
    this.color = color(255); // Couleur initiale
    this.oscillationOffset = random(0, TWO_PI); // Décalage pour oscillations 
  }

  update(energy) {
    // Taille dynamique
    this.size = map(energy, 0, 255, fontSize, fontSize * 2);

    // Rotation dynamique
    this.rotation = map(energy, 0, 255, -PI / 8, PI / 8);

    // Opacité dynamique
    this.opacity = map(energy, 0, 255, 50, 255);

    // Oscillation verticale
    let oscillation =
      sin(millis() / 500 + this.oscillationOffset) * map(energy, 0, 255, 0, 20);
    this.y = this.baseY + oscillation;

    // Couleurs dynamiques
    this.color = color(
      map(energy, 0, 255, 100, 255), // Rouge
      map(energy, 0, 255, 50, 200), // Vert
      map(energy, 0, 255, 150, 255) // Bleu
    );
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    // Halo lumineux autour de la lettre
    noFill();
    stroke(this.color);
    strokeWeight(10);
    textSize(this.size);
    text(this.char, 0, 0);

    // Affichage principal de la lettre
    noStroke();
    fill(this.color);
    textSize(this.size);
    text(this.char, 0, 0);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
