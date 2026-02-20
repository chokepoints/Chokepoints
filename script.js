const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w = 0;
let h = 0;
const nodes = [];

function getNodeCount() {
  return Math.max(210, Math.floor((w * h) / 8500));
}

function createNode() {
  return {
    x: Math.random() * w,
    y: h * (0.46 + Math.random() * 0.54),
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() < 0.08 ? 2.9 : 1.2 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
    pulse: 0.5 + Math.random() * 1.2,
  };
}

function rebuildNodes() {
  nodes.length = 0;
  const count = getNodeCount();
  for (let i = 0; i < count; i += 1) {
    nodes.push(createNode());
  }
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  rebuildNodes();
}

function updateNodes(t) {
  for (const n of nodes) {
    n.x += n.vx + Math.sin((t * 0.0012) + n.phase) * 0.22;
    n.y += n.vy + Math.cos((t * 0.001) + n.phase) * 0.12;

    if (n.x < -20 || n.x > w + 20) n.vx *= -1;
    if (n.y < h * 0.42 || n.y > h + 20) n.vy *= -1;
  }
}

function drawLinks(t) {
  const maxDist = 150;
  const maxDistSq = maxDist * maxDist;
  const pulse = 0.78 + Math.sin(t * 0.002) * 0.22;

  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > maxDistSq) continue;

      const alpha = 0.38 * (1 - d2 / maxDistSq) * pulse;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(22,64,255,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawNodes(t) {
  for (const n of nodes) {
    const glow = 0.9 + Math.sin((t * 0.003) * n.pulse + n.phase) * 0.25;
    const rr = n.r * glow;
    ctx.beginPath();
    ctx.fillStyle = n.r > 2.5 ? "rgba(22,64,255,0.9)" : "rgba(22,64,255,0.62)";
    ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw(t) {
  ctx.clearRect(0, 0, w, h);
  updateNodes(t);
  drawLinks(t);
  drawNodes(t);
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
