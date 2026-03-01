// ══════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════
const COFFEES = [
  {
    id: 0,
    name: "Cappuccino",
    sub: "Classic Italian",
    price: "€ 4.20",
    origin: "Ethiopia",
    bg: "linear-gradient(145deg,#C4885A,#A97544 55%,#8B6340)",
    glow: "rgba(220,130,70,.55)",
    info: ["180ml", "63mg", "Medium", "120 kcal", "4.8 ★"],
    esp: [38, 16, 4],
    milk: [205, 145, 75],
    foam: [248, 236, 210],
    hasMilk: true,
    steamY: 42,
    video1: "assets/video1capuccino.mp4",
    video2: "assets/video2capuccino.mp4",
    image: "assets/grok-image-3af9ea0f-bdbf-4da2-804e-0f58aa208476 (1).png",
    imageTop: "-20px",
    imageWidth: "290px",
    imageHeight: "300px",
    cardTextMain: "#3a2818",
    cardTextSub: "#6b5433",
    cardEye: "#B8860B",
    infoBg: "#D4C9B8",
    infoText: "#3a2818",
    rcilColor: "#5a3010",
    sugarBotDist: 80,
  },
  {
    id: 1,
    name: "Espresso",
    sub: "Just coffee, no milk",
    price: "€ 2.90",
    origin: "Brazil",
    bg: "linear-gradient(145deg,#3A2010,#240E05 55%,#130602)",
    glow: "rgba(160,80,20,.62)",
    info: ["30ml", "63mg", "Dark", "5 kcal", "5.0 ★"],
    esp: [18, 7, 2],
    milk: null,
    foam: [175, 110, 22],
    hasMilk: false,
    steamY: 95,
    video1: "assets/vide01.mp4",
    video2: "assets/videopermanent.mp4",
    image: "assets/imageespresso.png",
    imageTop: "-30px",
    imageWidth: "200px",
    imageHeight: "210px",
    cardTextMain: "#3a2818",
    cardTextSub: "#6b5433",
    cardEye: "#8b6f47",
    infoBg: "#0c0806",
    infoText: "#ffffff",
    rcilColor: "#F5EDD8",
    sugarBotDist: 30,
  },
];

// ══════════════════════════════════════════════════════
//  BREW CANVAS (not used - replaced with video)
// ══════════════════════════════════════════════════════
// const BC = document.getElementById('bc');
// const bx = BC.getContext('2d');
// const BW = BC.width, BH = BC.height;

// Cup geometry (center-x, rim-y, etc.)
const G = { cx: 170, rimY: 220, rimRx: 112, rimRy: 20, botY: 400, botRx: 82 };

let braf = null,
  bT = 0;
// Pour state
let espFill = 0,
  milkFill = 0,
  foamFill = 0,
  bPhase = 0;
let ripples = [],
  pourActive = false;
let pourColor = [38, 16, 4];
let curCoffee = null;

function startBrew(cf) {
  curCoffee = cf;
  if (braf) cancelAnimationFrame(braf);
  bT = 0;
  bPhase = 0;
  espFill = 0;
  milkFill = 0;
  foamFill = 0;
  pourActive = false;
  ripples = [];
  setPhaseText("", -1);

  function frame() {
    bT++;
    bx.clearRect(0, 0, BW, BH);
    drawBgVignette(bx, BW, BH);
    drawCupOutline(bx, G, cf);

    // Phase logic
    const hasMilk = cf.hasMilk;
    if (bPhase === 0 && bT > 22) {
      bPhase = 1;
      pourActive = true;
      pourColor = [...cf.esp];
      setPhaseText("Pulling espresso…", 0);
    }
    if (bPhase === 1) {
      espFill = Math.min(1, espFill + 0.007);
      if (espFill >= 1) {
        bPhase = hasMilk ? 2 : 3;
        pourColor = hasMilk ? [...cf.milk] : [...cf.foam];
        setPhaseText("Steaming espresso…", 1);
      }
    }
    if (bPhase === 2 && hasMilk) {
      milkFill = Math.min(1, milkFill + 0.006);
      if (milkFill >= 1) {
        bPhase = 3;
        pourColor = [...cf.foam];
        setPhaseText("Steaming espresso…", 2);
      }
    }
    if (bPhase === 3) {
      foamFill = Math.min(1, foamFill + 0.009);
      if (foamFill >= 1) {
        bPhase = 4;
        pourActive = false;
        setPhaseText("Ready ✓", 3);
        setTimeout(() => toSugar(), 900);
      }
    }

    // Draw liquid fill
    drawBrewFill(bx, G, cf, espFill, milkFill, foamFill, bPhase);

    // Stream + ripples
    if (pourActive) {
      drawStream(bx, G.cx, 55, G.rimY + 2, pourColor, bT);
      if (Math.random() < 0.28)
        ripples.push({
          x: G.cx + (Math.random() - 0.5) * 18,
          y: G.rimY + 3,
          r: 1,
          max: 26 + Math.random() * 16,
          a: 0.6,
        });
    }
    drawRipples(bx, ripples, bPhase, G);

    // Steam once done
    if (foamFill > 0.5) drawSteam(bx, G.cx, G.rimY - 8, foamFill, bT);

    braf = requestAnimationFrame(frame);
  }
  braf = requestAnimationFrame(frame);
}

function drawBgVignette(c, w, h) {
  const g = c.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w * 0.8);
  g.addColorStop(0, "rgba(15,8,3,0)");
  g.addColorStop(1, "rgba(5,2,0,.5)");
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
}

function drawCupOutline(c, g, cf) {
  const { cx, rimY, rimRx, rimRy, botY, botRx } = g;

  // shadow below saucer
  c.save();
  c.beginPath();
  c.ellipse(cx, botY + 30, rimRx + 32, 11, 0, 0, Math.PI * 2);
  c.fillStyle = "rgba(0,0,0,.3)";
  c.fill();

  // Saucer
  const sauG = c.createLinearGradient(cx - rimRx - 24, 0, cx + rimRx + 24, 0);
  sauG.addColorStop(0, "#B09050");
  sauG.addColorStop(0.38, "#EEE0C0");
  sauG.addColorStop(1, "#A08040");
  c.beginPath();
  c.ellipse(cx, botY + 22, rimRx + 26, 11, 0, 0, Math.PI * 2);
  c.fillStyle = sauG;
  c.fill();
  c.beginPath();
  c.ellipse(cx, botY + 18, rimRx + 18, 8, 0, 0, Math.PI * 2);
  c.fillStyle = "#EAD8B0";
  c.fill();
  c.beginPath();
  c.ellipse(cx, botY + 15, rimRx - 8, 5, 0, 0, Math.PI * 2);
  c.fillStyle = "#C8A870";
  c.fill();
  // saucer highlight
  c.beginPath();
  c.moveTo(cx - rimRx - 8, botY + 21);
  c.quadraticCurveTo(cx - rimRx * 0.5, botY + 12, cx, botY + 17);
  c.strokeStyle = "rgba(255,255,255,.45)";
  c.lineWidth = 1.8;
  c.lineCap = "round";
  c.stroke();

  // Cup body gradient
  const bG = c.createLinearGradient(cx - rimRx, 0, cx + rimRx, 0);
  bG.addColorStop(0, "#EEE6D4");
  bG.addColorStop(0.16, "#FDFAF2");
  bG.addColorStop(0.52, "#F0E0C8");
  bG.addColorStop(1, "#C8A870");
  c.beginPath();
  c.moveTo(cx - rimRx, rimY);
  c.bezierCurveTo(cx - rimRx - 10, botY - 22, cx - botRx, botY, cx, botY);
  c.bezierCurveTo(
    cx + botRx,
    botY,
    cx + rimRx + 10,
    botY - 22,
    cx + rimRx,
    rimY,
  );
  c.closePath();
  c.fillStyle = bG;
  c.fill();
  // shade top→bottom
  const sh = c.createLinearGradient(0, rimY, 0, botY);
  sh.addColorStop(0, "rgba(255,255,255,0)");
  sh.addColorStop(1, "rgba(55,20,5,.35)");
  c.fillStyle = sh;
  c.fill();
  // right shadow crescent
  c.beginPath();
  c.moveTo(cx + rimRx * 0.65, rimY);
  c.bezierCurveTo(cx + rimRx + 10, botY - 22, cx + botRx, botY, cx, botY);
  c.bezierCurveTo(cx + botRx, botY, cx + rimRx, botY - 28, cx + rimRx, rimY);
  c.closePath();
  c.fillStyle = "rgba(60,22,5,.2)";
  c.fill();
  // LEFT SHEEN — main
  c.beginPath();
  c.moveTo(cx - rimRx + 16, rimY + 14);
  c.quadraticCurveTo(cx - rimRx + 8, botY * 0.48, cx - rimRx + 12, botY - 18);
  c.strokeStyle = "rgba(255,255,255,.62)";
  c.lineWidth = 7;
  c.lineCap = "round";
  c.stroke();
  c.beginPath();
  c.moveTo(cx - rimRx + 26, rimY + 10);
  c.quadraticCurveTo(cx - rimRx + 20, botY * 0.48, cx - rimRx + 22, botY - 22);
  c.strokeStyle = "rgba(255,255,255,.22)";
  c.lineWidth = 3;
  c.stroke();

  // Handle
  const hcx = cx + rimRx + 2,
    hcy = (rimY + botY) / 2;
  const hdlG = c.createLinearGradient(hcx, rimY, hcx + 60, botY);
  hdlG.addColorStop(0, "#EEE0C4");
  hdlG.addColorStop(0.45, "#FFF8EE");
  hdlG.addColorStop(1, "#C0A060");
  c.beginPath();
  c.arc(hcx + 38, (rimY + botY) / 2, 50, -Math.PI * 0.5, Math.PI * 0.5, false);
  c.arc(hcx + 38, (rimY + botY) / 2, 30, Math.PI * 0.5, -Math.PI * 0.5, true);
  c.closePath();
  c.fillStyle = hdlG;
  c.fill();
  c.strokeStyle = "rgba(80,35,6,.22)";
  c.lineWidth = 1;
  c.stroke();
  c.beginPath();
  c.arc(hcx + 38, (rimY + botY) / 2, 40, -1.15, 1.15, false);
  c.strokeStyle = "rgba(255,255,255,.35)";
  c.lineWidth = 2.5;
  c.lineCap = "round";
  c.stroke();

  // Rim ellipse (top)
  const rG = c.createLinearGradient(cx - rimRx, 0, cx + rimRx, 0);
  rG.addColorStop(0, "#E0CCA8");
  rG.addColorStop(0.34, "#FFF8EE");
  rG.addColorStop(1, "#C0A060");
  c.beginPath();
  c.ellipse(cx, rimY, rimRx, rimRy, 0, 0, Math.PI * 2);
  c.fillStyle = rG;
  c.fill();
  c.beginPath();
  c.ellipse(cx, rimY, rimRx - 4, rimRy - 3, 0, 0, Math.PI * 2);
  c.fillStyle = "rgba(28,10,2,.15)";
  c.fill();
  c.restore();
}

function drawBrewFill(c, g, cf, espF, milkF, foamF, phase) {
  const { cx, rimY, rimRx, rimRy, botY, botRx } = g;
  const usable = (botY - rimY) * 0.9;

  c.save();
  // clip to inside cup
  c.beginPath();
  c.ellipse(cx, rimY, rimRx - 5, rimRy - 2, 0, 0, Math.PI, true);
  c.bezierCurveTo(
    cx - botRx + 3,
    botY - 3,
    cx - botRx + 3,
    botY - 3,
    cx,
    botY - 3,
  );
  c.bezierCurveTo(
    cx + botRx - 3,
    botY - 3,
    cx + botRx - 3,
    botY - 3,
    cx + rimRx - 5,
    rimY,
  );
  c.clip();

  let y = botY - 4;

  // Espresso
  if (espF > 0) {
    const h = usable * 0.42 * espF;
    const [r, g2, b] = cf.esp;
    const eg = c.createLinearGradient(0, y - h, 0, y);
    eg.addColorStop(0, `rgba(${r + 12},${g2 + 5},${b + 2},.92)`);
    eg.addColorStop(1, `rgba(${r},${g2},${b},.98)`);
    c.fillStyle = eg;
    c.fillRect(cx - rimRx, y - h, rimRx * 2, h + 3);
    y -= h;
  }

  // Milk
  if (milkF > 0 && cf.hasMilk) {
    const [r, g2, b] = cf.milk;
    const h = usable * 0.38 * milkF;
    const mg = c.createLinearGradient(0, y - h, 0, y);
    mg.addColorStop(0, `rgba(${r},${g2},${b},.88)`);
    mg.addColorStop(1, `rgba(${r - 25},${g2 - 25},${b - 25},.94)`);
    c.fillStyle = mg;
    c.fillRect(cx - rimRx, y - h, rimRx * 2, h + 2);
    // milk/esp blend line
    if (milkF > 0.05 && milkF < 0.9) {
      c.beginPath();
      c.ellipse(cx, y + 3, rimRx * 0.42, 4, 0, 0, Math.PI * 2);
      c.fillStyle = `rgba(${r + 15},${g2 + 8},${b},.28)`;
      c.fill();
    }
    y -= h;
  }

  // Foam
  if (foamF > 0) {
    const [r, g2, b] = cf.foam;
    const h = usable * 0.2 * foamF;
    const fg = c.createLinearGradient(0, rimY + 2, 0, rimY + 2 + h);
    fg.addColorStop(0, `rgba(${r},${g2},${b},.96)`);
    fg.addColorStop(1, `rgba(${r - 12},${g2 - 12},${b - 12},.9)`);
    c.fillStyle = fg;
    c.fillRect(cx - rimRx, rimY + 2, rimRx * 2, h);
    // foam texture highlights
    if (foamF > 0.6) {
      c.fillStyle = `rgba(255,255,255,${0.26 * foamF})`;
      [
        [cx - 22, rimY + 5, 10, 3.5],
        [cx + 16, rimY + 7, 7.5, 2.5],
        [cx + 2, rimY + 4, 5, 2],
      ].forEach(([ex, ey, erx, ery]) => {
        c.beginPath();
        c.ellipse(ex, ey, erx, ery, 0, 0, Math.PI * 2);
        c.fill();
      });
    }
  }
  c.restore();
}

// Organic pour stream
function drawStream(c, fromX, fromY, toY, col, t) {
  const [r, g, b] = col;
  const wave = Math.sin(t * 0.18) * 2.5;
  const w = 5 + Math.sin(t * 0.09) * 2;

  c.save();
  c.beginPath();
  // Build the stream as a filled shape
  for (let y = fromY; y <= toY; y += 4) {
    const prog = (y - fromY) / (toY - fromY);
    const ww = w * (1 - prog * 0.35);
    const wx = wave * Math.sin(prog * Math.PI * 1.8) * (1 - prog * 0.4);
    if (y === fromY) c.moveTo(fromX - ww / 2 + wx, y);
    else c.lineTo(fromX - ww / 2 + wx, y);
  }
  for (let y = toY; y >= fromY; y -= 4) {
    const prog = (y - fromY) / (toY - fromY);
    const ww = w * (1 - prog * 0.35);
    const wx = wave * Math.sin(prog * Math.PI * 1.8) * (1 - prog * 0.4);
    c.lineTo(fromX + ww / 2 + wx, y);
  }
  c.closePath();
  const sg = c.createLinearGradient(0, fromY, 0, toY);
  sg.addColorStop(0, `rgba(${r},${g},${b},.95)`);
  sg.addColorStop(0.6, `rgba(${r},${g},${b},.82)`);
  sg.addColorStop(1, `rgba(${r + 18},${g + 8},${b + 4},.45)`);
  c.fillStyle = sg;
  c.fill();

  // Highlight edge on stream
  c.beginPath();
  c.moveTo(fromX - w / 2 + wave * 0.4, fromY);
  c.lineTo(fromX - w / 2 + 3 + wave * 0.4, toY);
  c.strokeStyle = `rgba(255,255,255,.18)`;
  c.lineWidth = 1.5;
  c.lineCap = "round";
  c.stroke();

  // Falling droplets
  for (let i = 0; i < 4; i++) {
    const dy = toY + Math.sin(t * 0.22 + i) * 8 + i * 5;
    const dx = fromX + Math.cos(t * 0.16 + i * 1.3) * 5;
    c.beginPath();
    c.arc(dx, dy, 1.8 - i * 0.3, 0, Math.PI * 2);
    c.fillStyle = `rgba(${r},${g},${b},${0.72 - i * 0.18})`;
    c.fill();
  }

  // Pitcher above stream
  drawPitcher(c, fromX, fromY - 8, col, t);
  c.restore();
}

function drawPitcher(c, cx, y, col, t) {
  const [r, g, b] = col;
  const tilt = Math.sin(t * 0.04) * 1.8;
  c.save();
  c.translate(cx, y + 20);
  c.rotate((tilt * Math.PI) / 180);

  // Body
  c.beginPath();
  c.moveTo(-30, -24);
  c.lineTo(-30, 18);
  c.quadraticCurveTo(-30, 28, 0, 30);
  c.quadraticCurveTo(30, 28, 30, 18);
  c.lineTo(30, -24);
  c.closePath();
  const pg = c.createLinearGradient(-30, 0, 30, 0);
  pg.addColorStop(0, "rgba(240,220,180,.12)");
  pg.addColorStop(0.22, "rgba(255,255,255,.09)");
  pg.addColorStop(1, "rgba(180,155,120,.07)");
  c.fillStyle = pg;
  c.fill();
  c.strokeStyle = "rgba(245,237,216,.18)";
  c.lineWidth = 1.5;
  c.stroke();

  // Liquid inside
  c.beginPath();
  c.moveTo(-28, -2);
  c.lineTo(-28, 18);
  c.quadraticCurveTo(-28, 26, 0, 28);
  c.quadraticCurveTo(28, 26, 28, 18);
  c.lineTo(28, -2);
  c.closePath();
  c.fillStyle = `rgba(${r},${g},${b},.72)`;
  c.fill();

  // Highlight
  c.beginPath();
  c.moveTo(-26, -20);
  c.lineTo(-26, 16);
  c.strokeStyle = "rgba(255,255,255,.28)";
  c.lineWidth = 3.5;
  c.lineCap = "round";
  c.stroke();

  // Rim
  c.beginPath();
  c.ellipse(0, -24, 30, 5.5, 0, 0, Math.PI * 2);
  c.strokeStyle = "rgba(245,237,216,.2)";
  c.lineWidth = 1.5;
  c.stroke();

  // Spout
  c.beginPath();
  c.moveTo(30, -6);
  c.quadraticCurveTo(46, -5, 44, 10);
  c.quadraticCurveTo(40, 24, 33, 30);
  c.strokeStyle = "rgba(245,237,216,.16)";
  c.lineWidth = 2;
  c.stroke();

  // Handle
  c.beginPath();
  c.arc(-46, 3, 20, -0.72, 0.72, false);
  c.arc(-46, 3, 12, 0.72, -0.72, true);
  c.closePath();
  c.fillStyle = "rgba(200,178,145,.1)";
  c.fill();
  c.strokeStyle = "rgba(245,237,216,.14)";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

function drawRipples(c, rips, phase, g) {
  for (let i = rips.length - 1; i >= 0; i--) {
    const r = rips[i];
    r.r += 0.75;
    r.a = 0.6 * (1 - r.r / r.max);
    if (r.r >= r.max || r.a <= 0) {
      rips.splice(i, 1);
      continue;
    }
    c.save();
    c.translate(r.x, r.y);
    c.scale(1, 0.22);
    c.beginPath();
    c.arc(0, 0, r.r, 0, Math.PI * 2);
    c.strokeStyle = `rgba(245,237,216,${r.a})`;
    c.lineWidth = 1;
    c.stroke();
    c.restore();
  }
}

function drawSteam(c, cx, y, alpha, t) {
  [
    { x: -18, h: 22, d: 0 },
    { x: 0, h: 30, d: 0.42 },
    { x: 18, h: 24, d: 0.8 },
  ].forEach((l) => {
    const ph = (t * 0.025 + l.d) % 1;
    const a = ph < 0.2 ? ph / 0.2 : ph > 0.8 ? (1 - ph) / 0.2 : 1;
    const rise = ph * 38;
    const wave = Math.sin(ph * Math.PI * 3) * 4.5;
    c.save();
    c.globalAlpha = a * 0.42 * alpha;
    c.strokeStyle = "rgba(245,237,216,1)";
    c.lineWidth = 2;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(cx + l.x + wave, y - rise);
    c.quadraticCurveTo(
      cx + l.x + wave * 2,
      y - rise - l.h * 0.5,
      cx + l.x + wave * 0.4,
      y - rise - l.h,
    );
    c.stroke();
    c.restore();
  });
}

function setPhaseText(txt, idx) {
  document.getElementById("bi-phase").textContent = txt;
  [0, 1, 2, 3].forEach((i) =>
    document.getElementById("pd" + i).classList.toggle("lit", i <= idx),
  );
}

// ══════════════════════════════════════════════════════
//  SUGAR CONTROLS (no canvas - just UI)
// ══════════════════════════════════════════════════════
let sugarCount = 0,
  selCoffee = null;

function createSugarDrop() {
  // Create drop element
  const drop = document.createElement("div");
  drop.className = "sugar-drop";

  // Position at button (bplus or bminus)
  const btn =
    document.querySelector(".bpm:hover") || document.getElementById("bplus");
  const rect = btn.getBoundingClientRect();
  const s2Inner = document.querySelector(".s2-inner");
  const s2Rect = s2Inner.getBoundingClientRect();
  const videoRect = document
    .querySelector(".brew-video")
    .getBoundingClientRect();

  const startX = rect.left - s2Rect.left + rect.width / 2;
  const startY = rect.top - s2Rect.top;

  // End position: center of video
  const endX = videoRect.left - s2Rect.left + videoRect.width / 2;
  const endY = videoRect.top - s2Rect.top + videoRect.height;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  drop.style.left = startX + "px";
  drop.style.top = startY + "px";
  drop.style.setProperty("--endX", deltaX + "px");
  drop.style.setProperty("--endY", deltaY + "px");

  s2Inner.appendChild(drop);

  // Remove after animation
  setTimeout(() => drop.remove(), 1200);
}

// ══════════════════════════════════════════════════════
//  CANVAS-BASED SUGAR PARTICLES
// ══════════════════════════════════════════════════════
const SC = document.getElementById("sugarCanvas");
const sx = SC.getContext("2d");
const SW = SC.width,
  SH = SC.height;

// Sugar cup geometry (positioned above video, matching cup in video)
const SG = {
  cx: SW / 2,
  rimY: SH * 0.65,
  rimRx: 50,
  rimRy: 12,
  botY: SH * 0.95,
  botRx: 36,
};

let sTick = 0;
let sugarParts = [],
  sugarRips = [];
let sraf = null;
let sugarTimeoutId = null;

function dropSugar() {
  // One cube falls from above
  sugarParts.push({
    x: SG.cx - 20 + (Math.random() - 0.5) * 12,
    y: SG.rimY - 120,
    vx: (Math.random() - 0.5) * 0.8,
    vy: 0,
    size: 20 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.12,
    phase: "fall",
    alpha: 1,
    dt: 0,
    drops: [],
  });

  if (!sraf) {
    animateSugarParticles();
  }
}

function animateSugarParticles() {
  function loop() {
    sTick++;
    sx.clearRect(0, 0, SW, SH);

    tickSugarParts();
    renderSugarParts(sx);
    renderSugarRips(sx);

    if (sugarParts.length > 0 || sugarRips.length > 0) {
      sraf = requestAnimationFrame(loop);
    } else {
      sraf = null;
      sTick = 0;
    }
  }
  sraf = requestAnimationFrame(loop);
}

function tickSugarParts() {
  for (let i = sugarParts.length - 1; i >= 0; i--) {
    const p = sugarParts[i];
    if (p.phase === "fall") {
      p.vy += 0.55;
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vrot;

      const dissolveDist =
        selCoffee && selCoffee.sugarBotDist ? selCoffee.sugarBotDist : 80;
      if (p.y >= SG.botY - dissolveDist) {
        p.phase = "dissolve";
        p.dt = 0;

        // Impact ripples
        // sugarRips.push({ x: p.x, y: SG.rimY + 2, r: 1, max: 28 + Math.random() * 10, a: 0.7 });
        // sugarRips.push({ x: p.x, y: SG.rimY + 2, r: 2, max: 18, a: 0.5, delay: 5 });
      }
    } else if (p.phase === "dissolve") {
      p.dt += 0.045;
      p.alpha = Math.max(0, 1 - p.dt);
      p.y += 0.5;

      // Move drops
      p.drops.forEach((d) => {
        d.vy += 0.22;
        d.x += d.vx;
        d.y += d.vy;
        d.alpha = Math.max(0, d.alpha - 0.03);
      });

      if (p.alpha <= 0) {
        sugarParts.splice(i, 1);
      }
    }
  }
}

function renderSugarParts(c) {
  sugarParts.forEach((p) => {
    // Splash drops first
    p.drops.forEach((d) => {
      if (d.alpha <= 0) return;
      c.save();
      c.globalAlpha = d.alpha;
      c.beginPath();
      c.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      c.fillStyle = "rgba(245, 237, 216, 0.75)";
      c.fill();
      c.restore();
    });

    // Main cube
    c.save();
    c.globalAlpha = p.alpha;
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    const sz = p.size;

    // Main face
    c.beginPath();
    c.moveTo(-sz / 2, -sz / 2);
    c.lineTo(sz / 2, -sz / 2);
    c.lineTo(sz / 2, sz / 2);
    c.lineTo(-sz / 2, sz / 2);
    c.closePath();
    const cg = c.createLinearGradient(-sz / 2, -sz / 2, sz / 2, sz / 2);
    cg.addColorStop(0, "#F8F0DC");
    cg.addColorStop(0.5, "#EEE0B8");
    cg.addColorStop(1, "#D8C888");
    c.fillStyle = cg;
    c.fill();

    // Edge shadow
    c.strokeStyle = "rgba(140, 108, 40, 0.32)";
    c.lineWidth = 0.8;
    c.stroke();

    // Top highlight panel
    c.beginPath();
    c.fillRect(-sz / 2 + 1, -sz / 2 + 1, sz - 2, sz * 0.35);
    c.fillStyle = "rgba(255, 255, 255, 0.35)";
    c.fill();

    // Bottom shadow panel
    c.beginPath();
    c.fillRect(-sz / 2 + 1, sz / 2 - sz * 0.25, sz - 2, sz * 0.24);
    c.fillStyle = "rgba(0, 0, 0, 0.12)";
    c.fill();

    // Granule texture dots
    c.fillStyle = "rgba(195, 165, 95, 0.55)";
    [
      [-2, -1.5],
      [1.5, -2],
      [-0.5, 1.5],
      [2.5, 1.8],
      [-3, 0.5],
    ].forEach(([dx, dy]) => {
      c.beginPath();
      c.arc(dx, dy, 0.7, 0, Math.PI * 2);
      c.fill();
    });

    c.restore();
  });
}

function renderSugarRips(c) {
  for (let i = sugarRips.length - 1; i >= 0; i--) {
    const r = sugarRips[i];
    if (r.delay && r.delay-- > 0) continue;
    r.r += 0.75;
    r.a = 0.7 * (1 - r.r / r.max);
    if (r.r >= r.max || r.a <= 0) {
      sugarRips.splice(i, 1);
      continue;
    }
    c.save();
    c.translate(r.x, r.y);
    c.scale(1, 0.2);
    c.beginPath();
    c.arc(0, 0, r.r, 0, Math.PI * 2);
    c.strokeStyle = `rgba(245, 237, 216, ${r.a})`;
    c.lineWidth = 1;
    c.stroke();
    c.restore();
  }
}

// ══════════════════════════════════════════════════════
//  SVG CUPS for result screen
// ══════════════════════════════════════════════════════
function capSVG() {
  return `<defs><linearGradient id="a" x1="5%" y1="8%" x2="95%" y2="92%"><stop offset="0%" stop-color="#F8F0E0"/><stop offset="18%" stop-color="#FFF8EE"/><stop offset="55%" stop-color="#F0E0C8"/><stop offset="100%" stop-color="#C8A870"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="rgba(255,255,255,0)"/><stop offset="100%" stop-color="rgba(80,35,8,.35)"/></linearGradient><linearGradient id="d" x1="5%" y1="5%" x2="95%" y2="95%"><stop offset="0%" stop-color="#E8D4B0"/><stop offset="35%" stop-color="#F8EED8"/><stop offset="100%" stop-color="#C0A060"/></linearGradient><linearGradient id="e" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#EEE0C4"/><stop offset="45%" stop-color="#FFF8EE"/><stop offset="100%" stop-color="#C0A060"/></linearGradient><radialGradient id="f" cx="40%" cy="35%" r="68%"><stop offset="0%" stop-color="#2C1204"/><stop offset="100%" stop-color="#0E0501"/></radialGradient><radialGradient id="h" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#FFFDF8"/><stop offset="45%" stop-color="#F5EADC"/><stop offset="100%" stop-color="#D8C09A"/></radialGradient><clipPath id="cc"><ellipse cx="112" cy="95" rx="46" ry="9.5"/></clipPath></defs>
<ellipse cx="112" cy="242" rx="80" ry="12" fill="rgba(200,130,60,.2)"/>
<ellipse cx="112" cy="232" rx="76" ry="12.5" fill="#A88040"/><ellipse cx="112" cy="228" rx="74" ry="11.5" fill="url(#d)"/>
<ellipse cx="112" cy="225" rx="68" ry="9" fill="#EEE0C0" opacity=".6"/><ellipse cx="112" cy="222" rx="38" ry="4.8" fill="#C8A870" opacity=".5"/>
<path d="M48 228 Q72 218 100 223" stroke="rgba(255,255,255,.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M67 95 Q63 214 112 219 Q161 214 157 95 Z" fill="url(#a)"/>
<path d="M67 95 Q63 214 112 219 Q161 214 157 95 Z" fill="url(#b)"/>
<path d="M136 96 Q154 145 152 212 Q162 200 157 95 Z" fill="rgba(80,38,8,.28)"/>
<path d="M76 108 Q71 154 74 208" stroke="rgba(255,255,255,.62)" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="112" cy="95" rx="46" ry="10" fill="url(#e)"/><ellipse cx="112" cy="96" rx="43" ry="8.5" fill="rgba(40,16,3,.15)"/>
<ellipse cx="112" cy="95" rx="42" ry="8.2" fill="url(#f)"/>
<ellipse cx="112" cy="93.5" rx="39.5" ry="7.5" fill="url(#h)"/>
<g clip-path="url(#cc)"><ellipse cx="112" cy="93" rx="26" ry="5" fill="rgba(150,80,18,.16)"/>
<path d="M112 86 Q111 93 112 98" stroke="rgba(90,42,8,.55)" stroke-width="1.4" fill="none"/>
<path d="M112 90 Q103 85 97 88 Q103 91 112 90 Z" fill="rgba(105,52,10,.42)"/>
<path d="M112 92 Q102 87 94 89 Q101 93 112 92 Z" fill="rgba(110,55,10,.38)"/>
<path d="M112 90 Q121 85 127 88 Q121 91 112 90 Z" fill="rgba(105,52,10,.42)"/>
<path d="M112 92 Q122 87 130 89 Q123 93 112 92 Z" fill="rgba(110,55,10,.38)"/>
<path d="M106 88 Q112 83 118 88 Q115 92 112 91 Q109 92 106 88 Z" fill="rgba(100,48,9,.5)"/>
</g>
<path d="M157 112 Q196 112 196 142 Q196 174 157 177" stroke="url(#e)" stroke-width="16" fill="none" stroke-linecap="round"/>
<path d="M157 112 Q192 113 192 142 Q192 170 157 173" stroke="#E8D8B8" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M157 116 Q187 117 187 142 Q187 167 157 169" stroke="rgba(255,255,255,.38)" stroke-width="2.5" fill="none"/>`;
}
function espSVG() {
  return `<defs><linearGradient id="ec" x1="5%" y1="8%" x2="95%" y2="92%"><stop offset="0%" stop-color="#7A3C18"/><stop offset="20%" stop-color="#9A4E22"/><stop offset="55%" stop-color="#8A4218"/><stop offset="100%" stop-color="#3A1808"/></linearGradient><linearGradient id="es" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="rgba(255,170,80,.05)"/><stop offset="100%" stop-color="rgba(10,3,0,.55)"/></linearGradient><linearGradient id="esau" x1="5%" y1="5%" x2="95%" y2="95%"><stop offset="0%" stop-color="#7A3C18"/><stop offset="40%" stop-color="#9A5022"/><stop offset="100%" stop-color="#4A2008"/></linearGradient><radialGradient id="ebr" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#1C0802"/><stop offset="100%" stop-color="#0A0401"/></radialGradient><radialGradient id="ecr" cx="40%" cy="35%" r="70%"><stop offset="0%" stop-color="#D49030"/><stop offset="40%" stop-color="#B87020"/><stop offset="100%" stop-color="#5A2C08"/></radialGradient><clipPath id="ecc"><ellipse cx="112" cy="128" rx="32" ry="7"/></clipPath><linearGradient id="ehdl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8A4218"/><stop offset="45%" stop-color="#A05225"/><stop offset="100%" stop-color="#5A2A0E"/></linearGradient></defs>
<ellipse cx="112" cy="248" rx="78" ry="11" fill="rgba(15,5,0,.25)"/>
<ellipse cx="112" cy="236" rx="80" ry="14" fill="#3A1808"/><ellipse cx="112" cy="231" rx="78" ry="13" fill="url(#esau)"/>
<ellipse cx="112" cy="228" rx="71" ry="10.5" fill="#8A4818"/>
<ellipse cx="112" cy="224" rx="36" ry="4.5" fill="#4A2008" opacity=".8"/>
<path d="M44 230 Q68 220 100 225" stroke="rgba(255,200,120,.4)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M80 128 Q76 215 112 219 Q148 215 144 128 Z" fill="url(#ec)"/>
<path d="M80 128 Q76 215 112 219 Q148 215 144 128 Z" fill="url(#es)"/>
<path d="M128 129 Q142 168 140 212 Q149 200 144 128 Z" fill="rgba(10,3,0,.38)"/>
<path d="M88 140 Q84 172 86 210" stroke="rgba(255,180,80,.5)" stroke-width="5.5" fill="none" stroke-linecap="round"/>
<ellipse cx="112" cy="128" rx="33" ry="7" fill="#9A5222"/>
<ellipse cx="112" cy="128" rx="29" ry="6" fill="url(#ebr)"/>
<ellipse cx="112" cy="126.5" rx="27" ry="5.5" fill="url(#ecr)"/>
<g clip-path="url(#ecc)">
<path d="M88 124.5 Q98 121.5 112 124.5 Q126 127.5 136 124.5" stroke="rgba(35,12,2,.6)" stroke-width="2" fill="none"/>
<path d="M90 127 Q100 124 112 127 Q124 130 134 127" stroke="rgba(35,12,2,.5)" stroke-width="1.5" fill="none"/>
<ellipse cx="104" cy="124" rx="7" ry="2.8" fill="rgba(230,170,45,.45)" transform="rotate(-12,104,124)"/>
</g>
<path d="M144 140 Q172 140 172 160 Q172 182 144 185" stroke="url(#ehdl)" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M144 140 Q168 141 168 160 Q168 179 144 181" stroke="#9A5222" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M144 143 Q164 144 164 160 Q164 176 144 178" stroke="rgba(255,160,60,.3)" stroke-width="2" fill="none"/>
<ellipse cx="66" cy="225" rx="12" ry="7" fill="#C8B890"/><ellipse cx="66" cy="225" rx="9" ry="5" fill="rgba(10,4,0,.3)"/>
<path d="M77 223 Q92 220 108 222" stroke="#C8B890" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // SCREEN ROUTING
  function show(id) {
    ["s1", "s2", "s3", "s4"].forEach((s, i) => {
      document.getElementById(s).classList.toggle("on", s === id);
      document.getElementById("d" + i).classList.toggle("on", s === id);
    });
    // Hide wordmark when not on S1
    const wordmark = document.querySelector(".wordmark");
    if (wordmark) {
      wordmark.style.opacity = id === "s1" ? "1" : "0";
      wordmark.style.pointerEvents = id === "s1" ? "auto" : "none";
    }
  }

  // S1 → S2 (original buttons 01-05 only)
  document.querySelectorAll(".cbtn[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Clear any pending timeout
      if (sugarTimeoutId) {
        clearTimeout(sugarTimeoutId);
        sugarTimeoutId = null;
      }
      
      selCoffee = COFFEES[+btn.dataset.id];
      document.getElementById("bi-name").textContent = selCoffee.name;
      sugarCount = 0; // Reset sugar count for new coffee
      sugarParts = []; // Clear existing sugar particles
      sugarRips = []; // Clear existing ripples
      updateSugarUI(); // Update display to show 0 sugar
      show("s2");

      // Play video
      const video = document.getElementById("brewVideo");
      const s3Panel = document.getElementById("s3Panel");
      const phaseEl = document.getElementById("bi-phase");
      let permVideo = document.getElementById("brewVideoPermanent");

      if (video) {
        // Set video source based on selected coffee
        const videoSource = video.querySelector("source");
        if (videoSource && selCoffee.video1) {
          videoSource.src = selCoffee.video1;
          video.load();
        }

        video.currentTime = 0;
        video.play();

        // Set permanent video source
        if (permVideo && selCoffee.video2) {
          const permVideoSource = permVideo.querySelector("source");
          if (permVideoSource) {
            permVideoSource.src = selCoffee.video2;
            permVideo.load();
          }
        }

        // Reset permanent video
        if (permVideo) {
          permVideo.pause();
          permVideo.currentTime = 0;
          permVideo.style.opacity = "0";
          permVideo.style.display = "none";
        }

        // Update phase text during video playback
        let phaseTexts = [
          "Pulling espresso…",
          "Steaming espresso…",
          "Steaming espresso…",
          "Ready ✓",
        ];

        // Custom phases for Cappuccino
        if (selCoffee && selCoffee.name === "Cappuccino") {
          phaseTexts = [
            "Pulling espresso…",
            "Steaming milk…",
            "Pouring milk & foam…",
            "Ready ✓",
          ];
        }

        const videoDuration = video.duration || 8; // fallback 8s
        let currentPhase = 0;
        let phaseTimer;
        let permVideoStarted = false;

        const updatePhase = () => {
          const progress = video.currentTime / videoDuration;
          let newPhase = Math.floor(progress * 4);
          if (newPhase > 3) newPhase = 3;

          if (newPhase !== currentPhase) {
            currentPhase = newPhase;
            phaseEl.textContent = phaseTexts[newPhase];
            phaseEl.style.opacity = "1";
          }

          // Check if we should start permanent video (0.3s before end)
          const timeRemaining = videoDuration - video.currentTime;
          if (timeRemaining <= 0.3 && !permVideoStarted) {
            if (permVideo) {
              permVideoStarted = true;
              permVideo.style.display = "block";
              permVideo.currentTime = 0;
              permVideo.play();
              // Fade in permanent video via CSS transition (150ms delay to ensure render)
              setTimeout(() => {
                permVideo.style.opacity = "1";
              }, 150);
            }
          }
        };

        video.addEventListener("timeupdate", updatePhase);

        // Handle when video metadata is loaded
        video.onloadedmetadata = () => {
          // Reset phase timer if it exists
          if (phaseTimer) clearInterval(phaseTimer);
        };

        // When video ends, show sugar panel from right
        video.onended = () => {
          clearInterval(phaseTimer);
          clearTimeout(sugarTimeoutId);
          phaseEl.textContent = "Ready ✓";
          s3Panel.classList.add("show");
          // Ensure permanent video is started and visible
          if (permVideo) {
            if (!permVideoStarted) {
              permVideo.style.display = "block";
              permVideo.currentTime = 0;
              permVideo.play();
              permVideoStarted = true;
            }
            permVideo.style.opacity = "1";
          }
        };

        // Fallback timeout to ensure sugar panel shows (for safety)
        sugarTimeoutId = setTimeout(() => {
          if (!s3Panel.classList.contains("show")) {
            phaseEl.textContent = "Ready ✓";
            s3Panel.classList.add("show");
            if (permVideo && !permVideoStarted) {
              permVideo.style.display = "block";
              permVideo.currentTime = 0;
              permVideo.play();
              permVideoStarted = true;
              setTimeout(() => {
                permVideo.style.opacity = "1";
              }, 150);
            }
          }
        }, (videoDuration || 8) * 1000 + 500);
        // Let video 2 loop naturally
        if (permVideo) {
          // Just let the loop attribute handle it naturally
        }
      }
    });
  });

  // Order another
  document.getElementById("bagain").addEventListener("click", () => {
    show("s1");
    selCoffee = null;
    sugarCount = 0;
  });

  // Init
  show("s1");

  // S2 → S3 (Sugar)
  function toSugar() {
    sugarCount = 0;
    updateSugarUI();
    // S3 panel on S2 just updates, stays visible via .show class
  }

  // Sugar controls
  document.getElementById("bplus").addEventListener("click", () => {
    if (sugarCount < 5) {
      dropSugar();
      sugarCount++;
      updateSugarUI();
    }
  });
  document.getElementById("bminus").addEventListener("click", () => {
    if (sugarCount > 0) {
      sugarCount--;
      updateSugarUI();
    }
  });
  document.getElementById("bconf").addEventListener("click", toResult);
  document.getElementById("bns").addEventListener("click", () => {
    sugarCount = 0;
    updateSugarUI();
    toResult();
  });

  // S3 → S4
  function toResult() {
    sugarCount = 0;
    if (sraf) {
      cancelAnimationFrame(sraf);
      sraf = null;
    }
    const cf = selCoffee;
    document.getElementById("rcbg").style.background = "#ffffff";
    // Set image based on selected coffee
    const rcimg = document.getElementById("rcimg");
    if (rcimg && cf.image) {
      rcimg.src = cf.image;
      rcimg.style.top = cf.imageTop || "-30px";
      rcimg.style.width = cf.imageWidth || "230px";
      rcimg.style.height = cf.imageHeight || "240px";
    }
    document.getElementById("rcglow").style.background =
      `radial-gradient(circle,${cf.glow} 0%,transparent 70%)`;

    // Apply coffee-specific colors
    document.getElementById("rcn1").style.color = cf.cardTextMain || "#3a2818";
    document.getElementById("rcn2").style.color = cf.cardTextSub || "#6b5433";
    document.getElementById("rcprice").style.color =
      cf.cardTextMain || "#3a2818";
    const rcEyeEl = document.querySelector(".rc-eye");
    if (rcEyeEl) rcEyeEl.style.color = cf.cardEye || "#8b6f47";
    const rcInfoEl = document.querySelector(".rc-info");
    if (rcInfoEl) rcInfoEl.style.background = cf.infoBg || "#0c0806";

    // Apply info text colors
    document.querySelectorAll(".rciv").forEach((el) => {
      el.style.color = cf.infoText || "#ffffff";
    });
    document.querySelectorAll(".rcil").forEach((el) => {
      el.style.color = cf.rcilColor || "#F5EDD8";
    });

    document.getElementById("rcn1").textContent = cf.name;
    document.getElementById("rcn2").textContent = cf.sub;
    document.getElementById("rcprice").textContent = cf.price;
    document.getElementById("rcorigin").textContent = cf.origin;
    const st = document.getElementById("rcstag");
    st.textContent =
      sugarCount === 0
        ? "No sugar"
        : sugarCount === 1
          ? "1 sugar"
          : `${sugarCount} sugars`;
    st.style.color = sugarCount > 0 ? "var(--gold)" : "var(--mut)";
    cf.info.forEach(
      (v, i) => (document.getElementById("ri" + i).textContent = v),
    );
    // fillSVG(document.getElementById("rcsvg"), cf.id, sugarCount); // Disabled - using image instead
    // steam
    const stm = document.getElementById("rcsteam");
    stm.innerHTML =
      '<div class="sv" style="height:18px"></div><div class="sv" style="height:26px"></div><div class="sv" style="height:20px"></div>';
    stm.style.cssText = `left:${cf.steamY * 0.7}px;top:${cf.steamY - 30}px;`;
    show("s4");
  }

  // Order another
  document.getElementById("bagain").addEventListener("click", () => {
    show("s1");
    selCoffee = null;
    sugarCount = 0;
    // Reset permanent video
    const permVideo = document.getElementById("brewVideoPermanent");
    if (permVideo) {
      permVideo.pause();
      permVideo.currentTime = 0;
      permVideo.style.opacity = "0";
    }
  });
});

// Sugar controls
function updateSugarUI() {
  const n = document.getElementById("snum");
  n.textContent = sugarCount;
  n.classList.remove("pop");
  void n.offsetWidth;
  n.classList.add("pop");
  setTimeout(() => n.classList.remove("pop"), 240);
  document.getElementById("sunit").textContent =
    sugarCount === 1 ? "sugar\nadded" : "sugars\nadded";
  for (let i = 0; i < 5; i++) {
    const c = document.getElementById("scb" + i);
    c.style.transitionDelay = i < sugarCount ? i * 0.06 + "s" : "0s";
    c.classList.toggle("on", i < sugarCount);
  }
  document.getElementById("bminus").disabled = sugarCount === 0;
  document.getElementById("bplus").disabled = sugarCount >= 5;
}
