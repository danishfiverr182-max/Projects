const W = 230, H = 280;
const BLOCK_H = 30;
const BLOCK_GAP = 6;
const BLOCK_W = 218;
const BLOCK_X = 6;
const NUM_BLOCKS = 4;
const BLOCK_HPS = [100, 80, 60, 40];
const INIT_SPEED = 190;

function makeBlocks() {
  const blocks = [];
  for (let i = 0; i < NUM_BLOCKS; i++) {
    const hp = BLOCK_HPS[i];
    blocks.push({
      x: BLOCK_X,
      y: 12 + i * (BLOCK_H + BLOCK_GAP),
      w: BLOCK_W,
      h: BLOCK_H,
      hp,
      maxHp: hp,
      flash: 0
    });
  }
  return blocks;
}

function makeState(type) {
  return {
    type,
    ball: { x: W / 2, y: H - 22, r: 7, vx: 0, vy: 0 },
    blocks: makeBlocks(),
    done: false,
    won: false
  };
}

let states = [makeState('size'), makeState('speed')];
let running = false;
let rafId = null;
let lastTime = null;

const ctxs = ['c1','c2'].map(id => document.getElementById(id).getContext('2d'));
const winnerMsg = document.getElementById('winner-msg');

function reset() {
  if (rafId) cancelAnimationFrame(rafId);
  running = false;
  lastTime = null;
  winnerMsg.textContent = 'Press Start to race!';
  winnerMsg.style.color = '#888';
  states = [makeState('size'), makeState('speed')];

  // Same launch angle for both — fair start
  const ang = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
  states.forEach(s => {
    s.ball.vx = Math.cos(ang) * INIT_SPEED;
    s.ball.vy = Math.sin(ang) * INIT_SPEED;
  });

  drawAll();
  updateStats();
}

function launch() {
  if (running) return;
  running = true;
  lastTime = null;
  winnerMsg.textContent = '🏁 Racing...';
  winnerMsg.style.color = '#888';
  rafId = requestAnimationFrame(loop);
}

function stepState(s, dt) {
  if (s.done) return;
  const b = s.ball;

  b.x += b.vx * dt;
  b.y += b.vy * dt;

  // Wall bounces
  if (b.x - b.r < 0)  { b.x = b.r;     b.vx =  Math.abs(b.vx); }
  if (b.x + b.r > W)  { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
  if (b.y - b.r < 0)  { b.y = b.r;     b.vy =  Math.abs(b.vy); }
  if (b.y + b.r > H)  { b.y = H - b.r; b.vy = -Math.abs(b.vy); }

  // SIZE BALL: clamp speed to INIT_SPEED every frame — only size changes, never speed
  if (s.type === 'size') {
    const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (spd > 0) { b.vx = (b.vx / spd) * INIT_SPEED; b.vy = (b.vy / spd) * INIT_SPEED; }
  }

  // Block collisions
  for (let i = s.blocks.length - 1; i >= 0; i--) {
    const blk = s.blocks[i];
    const cx = Math.max(blk.x, Math.min(b.x, blk.x + blk.w));
    const cy = Math.max(blk.y, Math.min(b.y, blk.y + blk.h));
    const dx = b.x - cx, dy = b.y - cy;
    const dist2 = dx * dx + dy * dy;

    if (dist2 < b.r * b.r) {
      blk.hp--;
      blk.flash = 0.12;

      if (s.type === 'size') {
        // Grow radius; speed stays locked above
        b.r = Math.min(b.r + 0.7, 200);
      } else {
        // Add flat +2px/s to speed, cap at 900
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const newSpd = Math.min(spd + 9, 9000);
        const scale = newSpd / (spd || 1);
        b.vx *= scale;
        b.vy *= scale;
      }

      // Push ball out of block
      const len = Math.sqrt(dist2) || 1;
      b.x += (dx / len) * (b.r - len);
      b.y += (dy / len) * (b.r - len);

      // Reflect off block face
      const inX = b.x > blk.x && b.x < blk.x + blk.w;
      const inY = b.y > blk.y && b.y < blk.y + blk.h;
      if (!inX) b.vx = -b.vx;
      else if (!inY) b.vy = -b.vy;
      else b.vy = -b.vy;

      if (blk.hp <= 0) s.blocks.splice(i, 1);
      if (s.blocks.length === 0) { s.done = true; s.won = true; }
    }
  }
}

const SIZE_COLOR  = '#f97316';
const SPEED_COLOR = '#06b6d4';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawState(ctx, s) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = s.type === 'size' ? '#fffaf7' : '#f5fefe';
  ctx.fillRect(0, 0, W, H);

  const color = s.type === 'size' ? SIZE_COLOR : SPEED_COLOR;
  const tint  = s.type === 'size' ? '#fff3e8' : '#e0f9ff';

  for (const blk of s.blocks) {
    blk.flash = Math.max(0, blk.flash - 0.025);
    const ratio = blk.hp / blk.maxHp;

    // Block base
    ctx.fillStyle = blk.flash > 0 ? '#fffde0' : tint;
    roundRect(ctx, blk.x, blk.y, blk.w, blk.h, 6);
    ctx.fill();

    // Health fill
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.18 + ratio * 0.65;
    roundRect(ctx, blk.x, blk.y, Math.max(blk.w * ratio, 6), blk.h, 6);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Border
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1;
    roundRect(ctx, blk.x, blk.y, blk.w, blk.h, 6);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // HP label
    ctx.fillStyle = '#222';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(blk.hp, blk.x + blk.w / 2, blk.y + blk.h / 2);
  }

  // Ball soft glow
  const b = s.ball;
  const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.5);
  grd.addColorStop(0, color + '44');
  grd.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r * 2.5, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Ball body
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ball shine
  ctx.beginPath();
  ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.32, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();

  // Win/done overlay
  if (s.done) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color;
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.won ? '🏆 WINNER!' : '💀 LOSER!', W / 2, H / 2);
  }
}

function drawAll() { states.forEach((s, i) => drawState(ctxs[i], s)); }

function updateStats() {
  states.forEach((s, i) => {
    const b = s.ball;
    const prefix = i === 0 ? 's1' : 's2';
    const spd = Math.round(Math.sqrt(b.vx * b.vx + b.vy * b.vy));
    document.getElementById(prefix + 'r').textContent = b.r.toFixed(0) + 'px';
    document.getElementById(prefix + 'b').textContent = s.blocks.length;
    document.getElementById(prefix + 's').textContent = spd;
  });
}

function loop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = Math.min((ts - lastTime) / 1000, 0.033);
  lastTime = ts;

  states.forEach(s => { if (!s.done) stepState(s, dt); });
  drawAll();
  updateStats();

  if (winnerMsg.textContent === '🏁 Racing...') {
    const winner = states.find(s => s.won);
    if (winner) {
  states.forEach(s => { if (!s.won) s.done = true; });
  const name = winner.type === 'size' ? '🟠 SIZE WINS!' : '🔵 SPEED WINS!';
  winnerMsg.textContent = name;
  winnerMsg.style.color = winner.type === 'size' ? '#f97316' : '#22d3ee';
}
  }

  if (!states.every(s => s.done)) rafId = requestAnimationFrame(loop);
  else running = false;
}

document.getElementById('btnStart').onclick = launch;
document.getElementById('btnReset').onclick  = reset;
reset();