const audioPath = "gydra_ikra.opus";
// const audioPath = "./Matroda_-_No Sleep_(6AM).opus";
const audio = new Audio(audioPath);
const audioCtx = new AudioContext();

const container = document.querySelector('#container');
const canvas = document.querySelector('#cnv');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let audioSrc;
let analyser;

container.addEventListener('click', () => {
    audio.play();
    // setTimeout(() => audio.pause(), 3000);
    audioSrc = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);

    const barWidth = canvas.width / bufLen;
    let barHeight;

    function animate(){
        let x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(data);

        for(let i = 0; i < bufLen; ++i) {
            // barHeight = data[i] * 1.5;
            barHeight = Math.pow(data[i], 1.5) / 10
            ctx.fillStyle = `hsl(${Math.min(i * 3, 359)}, 100%, 50%)`;
            console.log(ctx.fillStyle)
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }

        requestAnimationFrame(animate);
    }
    animate();
});