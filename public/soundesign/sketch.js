let song;
let fft;
let button;

function preload() {
  song = loadSound("/soundesign/Dreams.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  button = createButton("Démarrer la musique");
  button.position(20, 20);
  button.mousePressed(startMusic);

  fft = new p5.FFT();
  fft.setInput(song);
}

function startMusic() {
  if (!song.isPlaying()) {
    song.play();
    button.html("Pause la musique");
  } else {
    song.pause();
    button.html("Démarrer la musique");
  }
}

function draw() {
  background(255, 255, 255, 30);

  let spectrum = fft.analyze();

  let bass = fft.getEnergy("bass");
  let bassRadius = map(bass, 0, 255, 50, width / 3);
  let bassColorStart = color(255, 50, 100, 150);
  let bassColorEnd = color(100, 50, 255, 150);

  drawOrganicCircle(
    width / 4,
    height / 2,
    bassRadius,
    bass,
    bassColorStart,
    bassColorEnd
  );

  let mid = fft.getEnergy("mid");
  let midRadius = map(mid, 0, 255, 50, width / 4);
  let midColorStart = color(50, 150, 255, 120);
  let midColorEnd = color(50, 255, 100, 120);

  drawOrganicCircle(
    width / 2,
    height / 2,
    midRadius,
    mid,
    midColorStart,
    midColorEnd
  );

  let treble = fft.getEnergy("treble");
  let trebleRadius = map(treble, 0, 255, 50, width / 6);
  let trebleColorStart = color(100, 50, 255, 100);
  let trebleColorEnd = color(255, 100, 150, 100);

  drawOrganicCircle(
    (3 * width) / 4,
    height / 2,
    trebleRadius,
    treble,
    trebleColorStart,
    trebleColorEnd
  );
}

function drawOrganicCircle(x, y, radius, energy, colorStart, colorEnd) {
  push();
  translate(x, y);

  let numLayers = 5;

  for (let n = 0; n < numLayers; n++) {
    let layerRadius = radius * (1 - n / numLayers);
    let lerpedColor = lerpColor(colorStart, colorEnd, n / numLayers);

    stroke(lerpedColor);
    strokeWeight(2);

    beginShape();
    for (let i = 0; i < TWO_PI; i += 0.1) {
      let offset = map(sin(i * energy + n), -1, 1, -20, 20);
      let r = layerRadius + offset;
      let xPos = r * cos(i);
      let yPos = r * sin(i);
      vertex(xPos, yPos);
    }
    endShape(CLOSE);
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
