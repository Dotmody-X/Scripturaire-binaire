const canvas = document.getElementById("musicCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height =
    window.innerHeight - document.getElementById("title").offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      console.log("Animation running");

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 1.5;

        ctx.fillStyle = `rgb(${barHeight + 50}, ${100 - i}, ${150 + i})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        const circleRadius = barHeight / 5;
        ctx.beginPath();
        ctx.arc(
          x + barWidth / 2,
          canvas.height / 2 + Math.sin(i * 0.1) * barHeight,
          circleRadius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(150, ${barHeight + 100}, ${200 - i}, 255, 0.5)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + barWidth / 2, canvas.height / 2, barHeight / 4, 0, Math.PI);
        ctx.strokeStyle = `rgba(${i * 2}, ${barHeight + 50}, 200, 0.3)`;
        ctx.stroke();

        x += barWidth + 2;
      }

      requestAnimationFrame(animate);
    }

    animate();
  })
  .catch((err) => {
    console.error("Erreur de capture Audio :", err);
  });
