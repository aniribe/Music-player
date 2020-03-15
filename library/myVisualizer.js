var BAR_PAD = 10;
var BAR_WIDTH = 2;
var MAX_BARS = 50;
var MAX_BG_SCALE = 20;
var SMOOTHING_SAMPLES = 10;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

var audioCtx, analyser, source;

// canvas.width = window.innerWidth * 0.8;
// canvas.height = window.innerHeight * 0.4;

// window.onresize = function() {
//   canvas.width = window.innerWidth * 0.8;
//   canvas.height = window.innerHeight * 0.4;
// };

function draw_bars(values) {
  var len = values.length - ~~(values.length / MAX_BARS) * 4;
  var normFac = 255;
  var maxValue = normFac;
  var istep = ~~(len / MAX_BARS);
  var step = canvas.width / MAX_BARS;
  var x = BAR_WIDTH;
  var height = canvas.height - BAR_PAD * 2;

  for (var i = 0; i < len; i += istep) {
    var v = values[i] / maxValue;
    var h = v * height;
    var y = height / 2 - h / 2;
    ctx.beginPath();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.9)";
    ctx.lineWidth = BAR_WIDTH;
    ctx.lineCap = "round";
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
    x += step;
  }

  // Background size change with bass
  var fac = 0.0;
  var div = 0;
  for (var i = 0; i < len - SMOOTHING_SAMPLES; i++) {
    var avgN = 0.0;
    for (var j = 0; j < SMOOTHING_SAMPLES; j++) {
      avgN += Math.abs((values[i + j] / maxValue) * 2.0);
    }
    avgN /= SMOOTHING_SAMPLES;

    fac += avgN;
    div++;
  }
  fac /= div;
  fac *= MAX_BG_SCALE;

  var szW = ~~(150 + fac);
  var szH = ~~(100 + fac);
  var sz = szW.toString() + "% " + szH.toString() + "%";
  //   bg.style.backgroundSize = sz;
}

function mainloop() {
  var fbc = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(fbc);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_bars(fbc);

  requestAnimationFrame(mainloop);
}

function setVisualizer(player) {
  //   player.src = URL.createObjectURL(this.files[0]);
  //   player.load();
  //   sfbutton.classList.add("moveup");

  audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(player);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  //   player.play();
  mainloop();
}