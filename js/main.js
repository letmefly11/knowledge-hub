/* ============================================
   Knowledge Hub — Main JavaScript
   Interactive demos, animations, search, theme
   ============================================ */

// ==========================================
// Theme Toggle
// ==========================================
(function initTheme() {
  const saved = localStorage.getItem('kb-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcon();
})();

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  if (!icon) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  icon.textContent = isDark ? '\u2600' : '\u263E';
}

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('kb-theme', next);
  updateThemeIcon();
});

// ==========================================
// Mobile Menu
// ==========================================
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('mobile-open');
});

// ==========================================
// Search Modal
// ==========================================
const searchArticles = [
  { title: 'Attention Is All You Need', desc: 'Interactive exploration of the Transformer architecture', tags: 'deep learning transformer attention' },
  { title: 'Shannon Entropy Demystified', desc: 'Information theory from first principles', tags: 'information theory entropy bits' },
  { title: 'The Geometry of Gradient Descent', desc: 'Visualizing loss landscapes in 3D', tags: 'optimization gradient descent loss' },
  { title: 'Bayesian Thinking for Scientists', desc: 'Interactive prior-posterior visualizations', tags: 'bayesian statistics inference' },
  { title: 'Quantum Computing: Beyond the Hype', desc: 'Bloch sphere, circuit builder, quantum advantage', tags: 'quantum computing physics' },
  { title: 'Category Theory for Programmers', desc: 'Functors, monads, and natural transformations', tags: 'category theory math programming' },
  { title: 'The Alignment Problem', desc: 'Survey of AI alignment approaches', tags: 'ai alignment safety ethics' },
  { title: 'Fourier Analysis', desc: 'Decomposing signals into frequencies', tags: 'fourier analysis signal processing' },
  { title: 'Backpropagation', desc: 'How neural networks learn via chain rule', tags: 'neural network backprop gradient' },
  { title: 'Kolmogorov Complexity', desc: 'The shortest program that produces a string', tags: 'complexity theory information' },
];

const searchTrigger = document.getElementById('searchTrigger');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchTrigger?.addEventListener('click', openSearch);
searchModal?.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearch();
});

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') closeSearch();
});

function openSearch() {
  searchModal?.classList.add('active');
  setTimeout(() => searchInput?.focus(), 100);
}
function closeSearch() {
  searchModal?.classList.remove('active');
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '<div class="search-empty">Type to search across all articles and knowledge notes</div>';
}

searchInput?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) {
    searchResults.innerHTML = '<div class="search-empty">Type to search across all articles and knowledge notes</div>';
    return;
  }
  const matches = searchArticles.filter(a =>
    a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.tags.includes(q)
  );
  if (matches.length === 0) {
    searchResults.innerHTML = '<div class="search-empty">No results found for "' + q + '"</div>';
    return;
  }
  searchResults.innerHTML = matches.map(a => `
    <a href="article.html" class="search-result-item">
      <h4>${a.title}</h4>
      <p>${a.desc}</p>
    </a>
  `).join('');
});

// ==========================================
// Reading Progress Bar
// ==========================================
const progressBar = document.getElementById('readingProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });
}

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .stagger-children').forEach(el => observer.observe(el));

// ==========================================
// Counter Animation (Hero Stats)
// ==========================================
function animateCounters() {
  document.querySelectorAll('.number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ==========================================
// TOC Active State (Article Page)
// ==========================================
const tocLinks = document.querySelectorAll('.toc-list a');
if (tocLinks.length > 0) {
  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    const heading = document.getElementById(id);
    if (heading) headings.push({ el: heading, link });
  });

  window.addEventListener('scroll', () => {
    let active = headings[0];
    for (const h of headings) {
      if (h.el.getBoundingClientRect().top <= 100) active = h;
    }
    tocLinks.forEach(l => l.classList.remove('active'));
    if (active) active.link.classList.add('active');
  });
}

// ==========================================
// Code Copy Button
// ==========================================
window.copyCode = function(btn) {
  const pre = btn.closest('.code-block-header')?.nextElementSibling;
  if (!pre) return;
  navigator.clipboard.writeText(pre.textContent).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
};

window.copyArticleLink = function(btn) {
  navigator.clipboard.writeText(window.location.href).then(() => {
    btn.textContent = '\u2713 Copied!';
    setTimeout(() => btn.textContent = '\uD83D\uDD17 Link', 2000);
  });
};

// ==========================================
// Neural Network Canvas (Featured Card)
// ==========================================
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], connections = [];
  let animFrame;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function createNodes() {
    nodes = [];
    connections = [];
    const layers = [4, 6, 8, 6, 4];
    const layerX = layers.map((_, i) => (i + 1) * w / (layers.length + 1));
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const y = (i + 1) * h / (count + 1);
        nodes.push({
          x: layerX[li], y, layer: li,
          radius: 4 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.02
        });
      }
    });
    // connections between adjacent layers
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].layer === nodes[i].layer + 1 && Math.random() > 0.3) {
          connections.push({ from: i, to: j, strength: Math.random() });
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // connections
    connections.forEach(c => {
      const a = nodes[c.from], b = nodes[c.to];
      const pulse = (Math.sin(a.pulse) + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(167,139,250,${0.05 + pulse * c.strength * 0.15})`;
      ctx.lineWidth = 0.5 + pulse * c.strength;
      ctx.stroke();
    });
    // nodes
    nodes.forEach(n => {
      n.pulse += n.speed;
      const pulse = (Math.sin(n.pulse) + 1) / 2;
      const r = n.radius + pulse * 2;
      // glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${0.05 + pulse * 0.08})`;
      ctx.fill();
      // node
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${0.5 + pulse * 0.5})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();
  window.addEventListener('resize', () => { resize(); createNodes(); });
}

// ==========================================
// Interactive Demo — Wave / Fourier / Attractor
// ==========================================
function initDemoCanvas() {
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, currentDemo = 'wave', animFrame;
  const params = { freq: 5, amp: 50, phase: 0 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = Math.min(rect.height, 400);
  }

  // Param listeners
  document.getElementById('param1')?.addEventListener('input', e => params.freq = +e.target.value);
  document.getElementById('param2')?.addEventListener('input', e => params.amp = +e.target.value);
  document.getElementById('param3')?.addEventListener('input', e => params.phase = +e.target.value / 100);

  // Tab switching
  document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentDemo = tab.dataset.demo;
    });
  });

  let t = 0;
  let attractorPoints = [];

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#1c1917' : '#ffffff';
    const lineColor = isDark ? '#a78bfa' : '#6d28d9';
    const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
    const textColor = isDark ? '#a8a29e' : '#78716c';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    t += 0.02;

    if (currentDemo === 'wave') drawWave(ctx, lineColor, textColor);
    else if (currentDemo === 'fourier') drawFourier(ctx, lineColor, textColor);
    else if (currentDemo === 'attractor') drawAttractor(ctx, lineColor, isDark);

    animFrame = requestAnimationFrame(draw);
  }

  function drawWave(ctx, color, textColor) {
    const cy = h / 2;
    // Wave 1
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    for (let x = 0; x < w; x++) {
      const y = cy + Math.sin((x / w) * params.freq * Math.PI * 2 + t + params.phase) * params.amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Wave 2
    ctx.beginPath();
    ctx.strokeStyle = color.replace('6d28d9', 'ec4899').replace('a78bfa', 'f472b6');
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x++) {
      const y = cy + Math.sin((x / w) * params.freq * 1.5 * Math.PI * 2 - t * 0.7 + params.phase) * params.amp * 0.6;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Interference
    ctx.beginPath();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    for (let x = 0; x < w; x++) {
      const y1 = Math.sin((x / w) * params.freq * Math.PI * 2 + t + params.phase) * params.amp;
      const y2 = Math.sin((x / w) * params.freq * 1.5 * Math.PI * 2 - t * 0.7 + params.phase) * params.amp * 0.6;
      const y = cy + y1 + y2;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText('Wave 1 (primary)', 15, 25);
    ctx.fillStyle = '#ec4899';
    ctx.fillText('Wave 2 (secondary)', 15, 42);
    ctx.fillStyle = '#059669';
    ctx.fillText('Interference (sum)', 15, 59);
  }

  function drawFourier(ctx, color, textColor) {
    const cx = w * 0.25, cy = h / 2;
    const n = Math.floor(params.freq);
    let px = cx, py = cy;
    const trail = [];

    // Draw epicycles
    for (let i = 0; i < n; i++) {
      const k = 2 * i + 1;
      const r = (params.amp * 1.2) * (4 / (k * Math.PI));
      const angle = k * t * 2;
      const nx = px + r * Math.cos(angle);
      const ny = py + r * Math.sin(angle);

      // Circle
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Radius
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      px = nx;
      py = ny;
    }

    // Dot at tip
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Line to waveform
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(w * 0.5, py);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Draw resulting square wave approximation
    if (!window._fourierTrail) window._fourierTrail = [];
    window._fourierTrail.unshift(py);
    if (window._fourierTrail.length > w * 0.48) window._fourierTrail.pop();

    ctx.beginPath();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    window._fourierTrail.forEach((y, i) => {
      const x = w * 0.5 + i;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText(`Fourier Series: ${n} terms`, 15, 25);
    ctx.fillText('Approximating a square wave', 15, 42);
  }

  function drawAttractor(ctx, color, isDark) {
    if (attractorPoints.length === 0) {
      let x = 0.1, y = 0, z = 0;
      const sigma = 10, rho = 28, beta = 8/3;
      const dt = 0.005;
      for (let i = 0; i < 8000; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        attractorPoints.push({ x, y, z });
      }
    }

    const scale = params.amp * 0.06 + 2;
    const rotY = t * 0.3 + params.phase;
    const cosR = Math.cos(rotY), sinR = Math.sin(rotY);
    const cx = w / 2, cy = h / 2;

    const numVisible = Math.min(attractorPoints.length, Math.floor(params.freq * 400));

    ctx.beginPath();
    for (let i = 0; i < numVisible; i++) {
      const p = attractorPoints[i];
      const rx = p.x * cosR - p.z * sinR;
      const ry = p.y;
      const sx = cx + rx * scale;
      const sy = cy + ry * scale;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Color gradient trace for last 500 points
    for (let i = Math.max(0, numVisible - 500); i < numVisible; i++) {
      const p = attractorPoints[i];
      const rx = p.x * cosR - p.z * sinR;
      const ry = p.y;
      const sx = cx + rx * scale;
      const sy = cy + ry * scale;
      const alpha = (i - (numVisible - 500)) / 500;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(167,139,250,${alpha * 0.8})`
        : `rgba(109,40,217,${alpha * 0.8})`;
      ctx.fill();
    }

    const textColor = isDark ? '#a8a29e' : '#78716c';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText('Lorenz Attractor (3D rotation)', 15, 25);
    ctx.fillText(`Points: ${numVisible}`, 15, 42);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

// ==========================================
// Attention Heatmap (Article Page)
// ==========================================
function initAttentionCanvas() {
  const canvas = document.getElementById('attentionCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat'];
  const n = tokens.length;
  let temperature = 0.5;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 300;
  }

  document.getElementById('tempSlider')?.addEventListener('input', e => {
    temperature = e.target.value / 100;
    draw();
  });

  function softmax(arr, temp) {
    const t = Math.max(temp, 0.01);
    const maxVal = Math.max(...arr);
    const exps = arr.map(v => Math.exp((v - maxVal) / t));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sum);
  }

  // Random attention scores
  const rawScores = [];
  for (let i = 0; i < n; i++) {
    rawScores[i] = [];
    for (let j = 0; j < n; j++) {
      rawScores[i][j] = Math.random() * 2 - 0.5;
      if (i === j) rawScores[i][j] += 1.5;
      if (Math.abs(i - j) === 1) rawScores[i][j] += 0.8;
    }
  }

  let hoveredCell = null;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cellSize = Math.min((canvas.width - 120) / n, (canvas.height - 80) / n);
    const ox = 80, oy = 50;
    const col = Math.floor((mx - ox) / cellSize);
    const row = Math.floor((my - oy) / cellSize);
    if (row >= 0 && row < n && col >= 0 && col < n) {
      hoveredCell = { row, col };
    } else {
      hoveredCell = null;
    }
    draw();
  });

  canvas.addEventListener('mouseleave', () => { hoveredCell = null; draw(); });

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#1c1917' : '#ffffff';
    const textColor = isDark ? '#e7e5e4' : '#1c1917';
    const mutedColor = isDark ? '#78716c' : '#a8a29e';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = Math.min((canvas.width - 120) / n, (canvas.height - 80) / n);
    const ox = 80, oy = 50;

    // Header labels
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = mutedColor;
    ctx.textAlign = 'center';
    for (let j = 0; j < n; j++) {
      ctx.fillText(tokens[j], ox + j * cellSize + cellSize / 2, oy - 12);
    }
    // Row labels
    ctx.textAlign = 'right';
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = mutedColor;
      ctx.fillText(tokens[i], ox - 12, oy + i * cellSize + cellSize / 2 + 5);
    }

    // Heatmap
    for (let i = 0; i < n; i++) {
      const weights = softmax(rawScores[i], temperature);
      for (let j = 0; j < n; j++) {
        const x = ox + j * cellSize;
        const y = oy + i * cellSize;
        const w = weights[j];
        const r = Math.round(109 + (255 - 109) * (1 - w));
        const g = Math.round(40 + (255 - 40) * (1 - w));
        const b = Math.round(217 + (255 - 217) * (1 - w));
        ctx.fillStyle = isDark
          ? `rgba(167,139,250,${w * 0.9 + 0.05})`
          : `rgb(${r},${g},${b})`;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        // Value text
        ctx.fillStyle = w > 0.4 ? '#fff' : textColor;
        ctx.textAlign = 'center';
        ctx.font = '500 11px JetBrains Mono, monospace';
        ctx.fillText(w.toFixed(2), x + cellSize / 2, y + cellSize / 2 + 4);

        // Hover highlight
        if (hoveredCell && hoveredCell.row === i && hoveredCell.col === j) {
          ctx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Axis labels
    ctx.fillStyle = mutedColor;
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Key tokens \u2192', ox + (n * cellSize) / 2, oy - 30);
    ctx.save();
    ctx.translate(20, oy + (n * cellSize) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Query tokens \u2192', 0, 0);
    ctx.restore();

    // Hover tooltip
    if (hoveredCell) {
      const weights = softmax(rawScores[hoveredCell.row], temperature);
      const w = weights[hoveredCell.col];
      const txt = `${tokens[hoveredCell.row]} \u2192 ${tokens[hoveredCell.col]}: ${w.toFixed(4)}`;
      const tx = ox + hoveredCell.col * cellSize + cellSize / 2;
      const ty = oy + n * cellSize + 25;
      ctx.fillStyle = textColor;
      ctx.font = '600 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(txt, tx, ty);
    }
  }

  resize();
  draw();
  window.addEventListener('resize', () => { resize(); draw(); });
}

// ==========================================
// Architecture Diagram (Article Page)
// ==========================================
function initArchitectureCanvas() {
  const canvas = document.getElementById('architectureCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 400;
  }

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = isDark ? '#1c1917' : '#ffffff';
    const textColor = isDark ? '#e7e5e4' : '#1c1917';
    const mutedColor = isDark ? '#78716c' : '#a8a29e';
    const accentColor = isDark ? '#a78bfa' : '#6d28d9';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const midX = canvas.width / 2;
    const boxW = 160, boxH = 36, gap = 12;
    const encX = midX - boxW - 40;
    const decX = midX + 40;

    function drawBox(x, y, text, color, highlight) {
      const radius = 8;
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, radius);
      ctx.fillStyle = highlight ? accentColor : (isDark ? '#292524' : '#f5f5f4');
      ctx.fill();
      ctx.strokeStyle = highlight ? accentColor : (isDark ? '#44403c' : '#d6d3d1');
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = highlight ? '#ffffff' : textColor;
      ctx.font = '500 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + boxW / 2, y + boxH / 2 + 4);
    }

    function drawArrow(x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = mutedColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 6 * Math.cos(angle - 0.4), y2 - 6 * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - 6 * Math.cos(angle + 0.4), y2 - 6 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = mutedColor;
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = accentColor;
    ctx.font = '700 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ENCODER', encX + boxW / 2, 30);
    ctx.fillText('DECODER', decX + boxW / 2, 30);

    // Encoder stack
    let ey = 50;
    drawBox(encX, ey, 'Input Embedding', null, false); ey += boxH + gap;
    drawArrow(encX + boxW / 2, ey - gap, encX + boxW / 2, ey);
    drawBox(encX, ey, 'Positional Encoding', null, false); ey += boxH + gap;
    drawArrow(encX + boxW / 2, ey - gap, encX + boxW / 2, ey);
    drawBox(encX, ey, 'Multi-Head Attention', null, true); ey += boxH + gap;
    drawArrow(encX + boxW / 2, ey - gap, encX + boxW / 2, ey);
    drawBox(encX, ey, 'Add & Norm', null, false); ey += boxH + gap;
    drawArrow(encX + boxW / 2, ey - gap, encX + boxW / 2, ey);
    drawBox(encX, ey, 'Feed Forward', null, false); ey += boxH + gap;
    drawArrow(encX + boxW / 2, ey - gap, encX + boxW / 2, ey);
    drawBox(encX, ey, 'Add & Norm', null, false);
    const encOutY = ey + boxH;

    // x N
    ctx.fillStyle = mutedColor;
    ctx.font = 'italic 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('\u00d7 N', encX + boxW + 8, 210);

    // Decoder stack
    let dy = 50;
    drawBox(decX, dy, 'Output Embedding', null, false); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Positional Encoding', null, false); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Masked Attention', null, true); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Add & Norm', null, false); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Cross-Attention', null, true); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Add & Norm', null, false); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Feed Forward', null, false); dy += boxH + gap;
    drawArrow(decX + boxW / 2, dy - gap, decX + boxW / 2, dy);
    drawBox(decX, dy, 'Linear + Softmax', null, false);

    ctx.fillStyle = mutedColor;
    ctx.font = 'italic 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('\u00d7 N', decX + boxW + 8, 260);

    // Cross-attention arrow from encoder to decoder
    const crossY = 50 + (boxH + gap) * 4 + boxH / 2;
    drawArrow(encX + boxW, crossY, decX, crossY);
  }

  resize();
  draw();
  window.addEventListener('resize', () => { resize(); draw(); });
  // Redraw on theme change
  const obs = new MutationObserver(() => draw());
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ==========================================
// Article Hero Canvas (flowing particles)
// ==========================================
function initArticleHeroCanvas() {
  const canvas = document.getElementById('articleHeroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const count = 80;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5 + Math.random() * 2.5,
        alpha: 0.1 + Math.random() * 0.4
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ==========================================
// Knowledge Graph (Garden Page)
// ==========================================
function initKnowledgeGraph() {
  const canvas = document.getElementById('knowledge-graph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  const categories = {
    ai: { color: '#6d28d9', label: 'AI / ML' },
    math: { color: '#2563eb', label: 'Mathematics' },
    physics: { color: '#059669', label: 'Physics' },
    philosophy: { color: '#ea580c', label: 'Philosophy' },
    cs: { color: '#db2777', label: 'Computer Science' }
  };

  const graphNodes = [
    { id: 'attention', label: 'Self-Attention', cat: 'ai', growth: 'evergreen', desc: 'Core mechanism of transformers' },
    { id: 'transformer', label: 'Transformer', cat: 'ai', growth: 'evergreen', desc: 'Architecture behind modern LLMs' },
    { id: 'backprop', label: 'Backpropagation', cat: 'ai', growth: 'budding', desc: 'How neural networks learn' },
    { id: 'gradient', label: 'Gradient Descent', cat: 'ai', growth: 'budding', desc: 'Optimization by following gradients' },
    { id: 'rlhf', label: 'RLHF', cat: 'ai', growth: 'budding', desc: 'Training AI with human feedback' },
    { id: 'alignment', label: 'AI Alignment', cat: 'philosophy', growth: 'evergreen', desc: 'Ensuring AI benefits humanity' },
    { id: 'entropy', label: 'Entropy', cat: 'math', growth: 'evergreen', desc: 'Measure of uncertainty' },
    { id: 'info-theory', label: 'Information Theory', cat: 'math', growth: 'evergreen', desc: 'Mathematics of communication' },
    { id: 'kl-div', label: 'KL Divergence', cat: 'math', growth: 'budding', desc: 'Distance between distributions' },
    { id: 'bayes', label: "Bayes' Theorem", cat: 'math', growth: 'seedling', desc: 'Updating beliefs with evidence' },
    { id: 'fourier', label: 'Fourier Analysis', cat: 'math', growth: 'evergreen', desc: 'Decomposing signals' },
    { id: 'linear-alg', label: 'Linear Algebra', cat: 'math', growth: 'evergreen', desc: 'Foundation of ML math' },
    { id: 'kolmogorov', label: 'Kolmogorov Complexity', cat: 'cs', growth: 'seedling', desc: 'Shortest program for a string' },
    { id: 'category', label: 'Category Theory', cat: 'math', growth: 'budding', desc: 'Abstract mathematical structures' },
    { id: 'quantum', label: 'Quantum Computing', cat: 'physics', growth: 'evergreen', desc: 'Computing with quantum mechanics' },
    { id: 'loss-landscape', label: 'Loss Landscapes', cat: 'ai', growth: 'budding', desc: 'Topography of optimization' },
    { id: 'neural-net', label: 'Neural Networks', cat: 'ai', growth: 'evergreen', desc: 'Computational learning models' },
    { id: 'emergence', label: 'Emergence', cat: 'philosophy', growth: 'seedling', desc: 'Complex behavior from simple rules' },
    { id: 'complexity', label: 'Complexity Theory', cat: 'cs', growth: 'budding', desc: 'What is computable efficiently' },
    { id: 'thermodynamics', label: 'Thermodynamics', cat: 'physics', growth: 'seedling', desc: 'Energy, heat, and work' },
  ];

  const edges = [
    ['attention', 'transformer'], ['transformer', 'neural-net'], ['backprop', 'neural-net'],
    ['backprop', 'gradient'], ['gradient', 'loss-landscape'], ['loss-landscape', 'neural-net'],
    ['entropy', 'info-theory'], ['kl-div', 'info-theory'], ['kl-div', 'entropy'],
    ['entropy', 'thermodynamics'], ['bayes', 'kl-div'], ['info-theory', 'kolmogorov'],
    ['fourier', 'linear-alg'], ['linear-alg', 'neural-net'], ['linear-alg', 'attention'],
    ['category', 'linear-alg'], ['quantum', 'linear-alg'], ['quantum', 'fourier'],
    ['rlhf', 'alignment'], ['rlhf', 'neural-net'], ['alignment', 'emergence'],
    ['complexity', 'kolmogorov'], ['complexity', 'quantum'], ['emergence', 'thermodynamics'],
    ['transformer', 'rlhf'], ['entropy', 'neural-net'],
  ];

  let nodes = [];
  let dragging = null;
  let offsetX = 0, offsetY = 0;
  let selectedNode = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function initPositions() {
    const cx = w / 2, cy = h / 2;
    nodes = graphNodes.map((n, i) => {
      const angle = (i / graphNodes.length) * Math.PI * 2;
      const r = 150 + Math.random() * 100;
      return {
        ...n,
        x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 60,
        y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 60,
        vx: 0, vy: 0,
        radius: n.growth === 'evergreen' ? 20 : n.growth === 'budding' ? 16 : 12
      };
    });
  }

  function getNode(id) { return nodes.find(n => n.id === id); }

  // Simple force simulation
  function simulate() {
    const cx = w / 2, cy = h / 2;
    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 800 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx; nodes[i].vy -= fy;
        nodes[j].vx += fx; nodes[j].vy += fy;
      }
    }
    // Attraction along edges
    edges.forEach(([a, b]) => {
      const na = getNode(a), nb = getNode(b);
      if (!na || !nb) return;
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 120) * 0.005;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      na.vx += fx; na.vy += fy;
      nb.vx -= fx; nb.vy -= fy;
    });
    // Center gravity
    nodes.forEach(n => {
      n.vx += (cx - n.x) * 0.001;
      n.vy += (cy - n.y) * 0.001;
      if (n !== dragging) {
        n.vx *= 0.9;
        n.vy *= 0.9;
        n.x += n.vx;
        n.y += n.vy;
      }
      // Bounds
      n.x = Math.max(n.radius, Math.min(w - n.radius, n.x));
      n.y = Math.max(n.radius, Math.min(h - n.radius, n.y));
    });
  }

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#1c1917' : '#ffffff';
    ctx.fillRect(0, 0, w, h);

    simulate();

    // Draw edges
    edges.forEach(([a, b]) => {
      const na = getNode(a), nb = getNode(b);
      if (!na || !nb) return;
      const isHighlight = selectedNode && (selectedNode.id === a || selectedNode.id === b);
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = isHighlight
        ? (isDark ? 'rgba(167,139,250,0.6)' : 'rgba(109,40,217,0.5)')
        : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)');
      ctx.lineWidth = isHighlight ? 2 : 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const color = categories[n.cat]?.color || '#6d28d9';
      const isSelected = selectedNode && selectedNode.id === n.id;
      const isConnected = selectedNode && edges.some(([a, b]) =>
        (a === selectedNode.id && b === n.id) || (b === selectedNode.id && a === n.id)
      );
      const dimmed = selectedNode && !isSelected && !isConnected;

      // Glow
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = color + '22';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? (isDark ? '#292524' : '#e7e5e4') : color;
      ctx.globalAlpha = dimmed ? 0.3 : 1;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label
      ctx.fillStyle = dimmed
        ? (isDark ? '#57534e' : '#a8a29e')
        : (isDark ? '#e7e5e4' : '#1c1917');
      ctx.font = `${isSelected ? '600' : '500'} ${isSelected ? 13 : 11}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + n.radius + 16);
    });

    requestAnimationFrame(draw);
  }

  // Mouse interaction
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const n of nodes) {
      const dx = mx - n.x, dy = my - n.y;
      if (dx * dx + dy * dy < (n.radius + 5) * (n.radius + 5)) {
        dragging = n;
        offsetX = dx; offsetY = dy;
        selectedNode = n;
        showNodeDetail(n);
        return;
      }
    }
    selectedNode = null;
    hideNodeDetail();
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    dragging.x = e.clientX - rect.left - offsetX;
    dragging.y = e.clientY - rect.top - offsetY;
    dragging.vx = 0; dragging.vy = 0;
  });

  canvas.addEventListener('mouseup', () => { dragging = null; });
  canvas.addEventListener('mouseleave', () => { dragging = null; });

  // Hover cursor
  canvas.addEventListener('mousemove', (e) => {
    if (dragging) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let found = false;
    for (const n of nodes) {
      const dx = mx - n.x, dy = my - n.y;
      if (dx * dx + dy * dy < (n.radius + 5) * (n.radius + 5)) {
        canvas.style.cursor = 'grab';
        found = true;
        break;
      }
    }
    if (!found) canvas.style.cursor = 'default';
  });

  function showNodeDetail(n) {
    const panel = document.getElementById('nodeDetail');
    if (!panel) return;
    panel.style.display = 'block';
    document.getElementById('detailTitle').textContent = n.label;
    document.getElementById('detailDesc').textContent = n.desc;
    const growthEl = document.getElementById('detailGrowth');
    growthEl.textContent = '\u25CF ' + n.growth.charAt(0).toUpperCase() + n.growth.slice(1);
    growthEl.className = 'growth-indicator' + (n.growth === 'budding' ? ' budding' : n.growth === 'seedling' ? ' seedling' : '');

    const connEl = document.getElementById('detailConnections');
    const connected = edges
      .filter(([a, b]) => a === n.id || b === n.id)
      .map(([a, b]) => a === n.id ? b : a)
      .map(id => graphNodes.find(gn => gn.id === id))
      .filter(Boolean);
    connEl.innerHTML = connected.map(c =>
      `<span class="tag tag-purple" style="cursor:pointer">${c.label}</span>`
    ).join('');
  }

  function hideNodeDetail() {
    const panel = document.getElementById('nodeDetail');
    if (panel) panel.style.display = 'none';
  }

  document.getElementById('detailClose')?.addEventListener('click', () => {
    selectedNode = null;
    hideNodeDetail();
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // For now just highlight
    });
  });

  // Grid / Graph toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      document.getElementById('graphView').style.display = view === 'graph' ? 'block' : 'none';
      document.getElementById('gridView').style.display = view === 'grid' ? 'grid' : 'none';
      if (view === 'grid') populateGridView();
    });
  });

  function populateGridView() {
    const grid = document.getElementById('gridView');
    if (!grid || grid.children.length > 0) return;
    grid.innerHTML = graphNodes.map(n => `
      <div class="garden-node" onclick="location.href='article.html'">
        <div class="garden-node-header">
          <h4>${n.label}</h4>
          <span class="growth-indicator${n.growth === 'budding' ? ' budding' : n.growth === 'seedling' ? ' seedling' : ''}">&#9679; ${n.growth}</span>
        </div>
        <p>${n.desc}</p>
        <div class="node-connections">
          ${edges.filter(([a,b]) => a === n.id || b === n.id).map(() => '<div class="node-dot"></div>').join('')}
        </div>
      </div>
    `).join('');
  }

  resize();
  initPositions();
  draw();
  window.addEventListener('resize', () => { resize(); initPositions(); });
}

// ==========================================
// KaTeX rendering
// ==========================================
function renderMath() {
  if (typeof katex === 'undefined') return;
  const placeholder = document.getElementById('mathBlock1');
  if (placeholder) {
    const inner = placeholder.querySelector('.math-placeholder');
    if (inner) {
      try {
        katex.render(
          '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
          inner,
          { displayMode: true, throwOnError: false }
        );
      } catch (e) { /* fallback text stays */ }
    }
  }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initDemoCanvas();
  initAttentionCanvas();
  initArchitectureCanvas();
  initArticleHeroCanvas();
  initKnowledgeGraph();
  renderMath();
});
