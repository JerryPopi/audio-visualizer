const audioPath = "gydra_ikra.opus";
// const audioPath = "./Matroda_-_No Sleep_(6AM).opus";
// const audio = new Audio(audioPath);
const audio = document.querySelector("#audioctr");

const container = document.querySelector('#container');
const canvas = document.querySelector('#cnv');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


let audioSrc;
let analyser;
let audioCtx;
const fftSize = 512;
audio.addEventListener('play', () => {
    audioCtx ??= new AudioContext();

    audioSrc ??= audioCtx.createMediaElementSource(audio);
    analyser ??= audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = fftSize;

    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);

    const barWidth = canvas.width / bufLen;
    let barHeight;

    function animate(){
        if(!audio.paused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(data);

            // let x = 0;
            // for(let i = 0; i < bufLen; ++i) {
            //     // barHeight = data[i] * 1.5;
            //     barHeight = Math.pow(data[i], 1.5) / 10
            //     ctx.fillStyle = `hsl(${Math.min(i * 3, 359)}, 100%, 50%)`;
            //     // console.log(ctx.fillStyle)
            //     ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            //     x += barWidth;
            // }

            const ratio = 360 / bufLen;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const r  = 60;

            const mapval = (x, in_min = 0, in_max = 360, out_min = 0, out_max = bufLen) =>
            {
                return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            for(let i = 0; i < 360; i += ratio) {
                ctx.save()
                const rad = Math.PI / 180 * i;

                barHeight = Math.pow(data[mapval(i)], 1);

                ctx.fillStyle = `hsl(${Math.min(i, 359)}, 100%, 50%)`;
                ctx.translate(cx + Math.cos(rad) * r, cy + Math.sin(rad) * r);
                ctx.rotate(rad - Math.PI / 2);
                ctx.fillRect(0, 0, barWidth, barHeight);
                ctx.restore()
            }
        }

        setTimeout(() => requestAnimationFrame(animate), 5);
        // requestAnimationFrame(animate);
    }
    animate();
});