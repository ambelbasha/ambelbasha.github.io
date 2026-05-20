/* ================================================================
   aboutSkillsWebGL.js  —  About & Skills as wormhole corridor cards
   About   → "About Me" + "What I Bring" corridor cards
   Skills  → skill-category corridor cards with animated bars
   Both sections keep their original canvas as a subtle background
   All cards share the same 3-D rotateX reveal used by timeline-card
   ================================================================ */
(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */
  function rand(a, b) { return Math.random() * (b - a) + a; }

  /* ── Inject shared card styles (once) ────────────────────── */
  function injectStyles() {
    if (document.getElementById('wgl-card-styles')) return;
    const s = document.createElement('style');
    s.id = 'wgl-card-styles';
    s.textContent = `
      /* ── Canvas sits behind everything ── */
      .section-webgl-canvas {
        position: absolute;
        inset: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        opacity: 0.10;
        z-index: 0;
      }

      /* ── Perspective scene wrapper ── */
      .wgl-scene {
        position: relative;
        z-index: 1;
        perspective: 2200px;
        perspective-origin: 50% 20%;
        padding: 2rem 1.5rem 4rem;
        max-width: 900px;
        margin: 0 auto;
      }

      /* ── Corridor card — same 3-D mechanics as .timeline-card ── */
      .wgl-corridor-card {
        background: rgba(1, 22, 28, 0.94);
        border: 1px solid rgba(15, 164, 175, 0.12);
        border-radius: 20px;
        overflow: hidden;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow:
          0 8px 40px rgba(0, 0, 0, 0.55),
          0 0 0 1px rgba(15, 164, 175, 0.04) inset;
        opacity: 0;
        transform-origin: bottom center;
        transform: rotateX(40deg) rotateY(-2deg) scale(0.96) translateY(20px);
        transition:
          opacity   0.70s ease,
          transform 1.00s cubic-bezier(0.16, 1.0, 0.3, 1);
        margin-bottom: 3rem;
        position: relative;
      }

      /* Gradient accent bar on card top */
      .wgl-corridor-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          #0FA4AF                        0%,
          rgba(15, 164, 175, 0.55)      45%,
          #993528                       75%,
          #bb4232                      100%
        );
        border-radius: 20px 20px 0 0;
        z-index: 5;
      }

      /* Even cards tilt the other way */
      .wgl-corridor-card.wgl-even {
        transform: rotateX(40deg) rotateY(2deg) scale(0.96) translateY(20px);
      }

      /* Revealed — stands upright, same class name as timeline-card */
      .wgl-corridor-card.revealed {
        opacity: 1;
        transform: rotateX(0deg) rotateY(0deg) scale(1) translateY(0) !important;
      }

      /* ── Card header ── */
      .wgl-card-head {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 1.2rem 1.6rem;
        border-bottom: 1px solid rgba(15, 164, 175, 0.10);
        background: linear-gradient(
          100deg,
          rgba(15, 164, 175, 0.07)   0%,
          rgba(187, 66, 50, 0.04)  100%
        );
      }

      .wgl-card-icon {
        width: 40px; height: 40px;
        border-radius: 11px;
        background: rgba(15, 164, 175, 0.08);
        border: 1px solid rgba(15, 164, 175, 0.16);
        display: flex; align-items: center; justify-content: center;
        color: rgba(15, 164, 175, 0.80);
        font-size: 18px;
        flex-shrink: 0;
      }

      .wgl-card-title {
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.97);
        letter-spacing: -0.01em;
        margin: 0;
        flex: 1;
        font-family: var(--font-display, sans-serif);
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.60);
      }

      .wgl-card-badge {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(15, 164, 175, 0.50);
        padding: 3px 9px;
        border: 1px solid rgba(15, 164, 175, 0.14);
        border-radius: 20px;
        white-space: nowrap;
        font-family: var(--font-mono, monospace);
      }

      .wgl-card-body {
        padding: 1.3rem 1.6rem 1.5rem;
      }

      /* ── About Me — profile row ── */
      .wgl-profile-row {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .wgl-avatar {
        width: 82px; height: 82px;
        border-radius: 50%;
        background: rgba(15, 164, 175, 0.10);
        border: 2px solid rgba(15, 164, 175, 0.25);
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
        overflow: hidden;
      }

      .wgl-avatar img {
        width: 100%; height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .wgl-bio { flex: 1; min-width: 200px; }

      .wgl-bio-name {
        font-size: 1.25rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.97);
        font-family: var(--font-display, sans-serif);
        margin: 0 0 4px;
        letter-spacing: -0.02em;
      }

      .wgl-bio-role {
        font-size: 0.75rem;
        color: rgba(15, 164, 175, 0.65);
        font-family: var(--font-mono, monospace);
        letter-spacing: 0.10em;
        text-transform: uppercase;
        margin: 0 0 10px;
      }

      .wgl-bio-text {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.70);
        line-height: 1.70;
        margin: 0;
      }

      /* ── Quick-stats row ── */
      .wgl-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
        gap: 10px;
        margin-top: 1.2rem;
      }

      .wgl-stat {
        background: rgba(15, 164, 175, 0.05);
        border: 1px solid rgba(15, 164, 175, 0.12);
        border-radius: 10px;
        padding: 10px 14px;
        text-align: center;
        opacity: 0;
      }

      .wgl-corridor-card.revealed .wgl-stat {
        animation: wglSubIn 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        animation-delay: calc(var(--i, 0) * 0.08s + 0.60s);
      }

      .wgl-stat-num {
        font-size: 1.4rem;
        font-weight: 700;
        color: #0FA4AF;
        font-family: var(--font-display, sans-serif);
        display: block;
        line-height: 1;
      }

      .wgl-stat-lbl {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.38);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-top: 4px;
        display: block;
        font-family: var(--font-mono, monospace);
      }

      /* ── "What I Bring" grid ── */
      .wgl-bring-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .wgl-bring-card {
        background: rgba(15, 164, 175, 0.05);
        border: 1px solid rgba(15, 164, 175, 0.12);
        border-radius: 14px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        opacity: 0;
        transition: background 0.28s, border-color 0.28s;
      }

      .wgl-corridor-card.revealed .wgl-bring-card {
        animation: wglSubIn 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        animation-delay: calc(var(--i, 0) * 0.09s + 0.65s);
      }

      @media (hover: hover) and (pointer: fine) {
        .wgl-bring-card:hover {
          background: rgba(15, 164, 175, 0.09);
          border-color: rgba(15, 164, 175, 0.24);
        }
      }

      .wgl-bring-icon {
        width: 36px; height: 36px;
        border-radius: 10px;
        background: rgba(15, 164, 175, 0.10);
        border: 1px solid rgba(15, 164, 175, 0.20);
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
      }

      .wgl-bring-title {
        font-size: 13px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.93);
        font-family: var(--font-display, sans-serif);
        margin: 0;
      }

      .wgl-bring-desc {
        font-size: 11.5px;
        color: rgba(255, 255, 255, 0.58);
        line-height: 1.60;
        margin: 0;
      }

      /* ── Tag pills ── */
      .wgl-tag-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }

      .wgl-tag {
        font-size: 9px;
        font-family: var(--font-mono, monospace);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(15, 164, 175, 0.92);
        background: rgba(15, 164, 175, 0.09);
        border: 1px solid rgba(15, 164, 175, 0.20);
        border-radius: 5px;
        padding: 2px 6px;
      }

      .wgl-tag.warm {
        color: rgba(187, 66, 50, 0.95);
        background: rgba(187, 66, 50, 0.09);
        border-color: rgba(187, 66, 50, 0.22);
      }

      .wgl-tag.yellow {
        color: rgba(245, 199, 79, 0.95);
        background: rgba(245, 199, 79, 0.09);
        border-color: rgba(245, 199, 79, 0.22);
      }

      .wgl-tag.green {
        color: rgba(184, 196, 110, 0.95);
        background: rgba(184, 196, 110, 0.09);
        border-color: rgba(184, 196, 110, 0.22);
      }

      /* ── Skills grid ── */
      .wgl-skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
        gap: 10px;
      }

      .wgl-skill-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 11px;
        background: rgba(15, 164, 175, 0.03);
        border: 1px solid rgba(15, 164, 175, 0.08);
        opacity: 0;
      }

      .wgl-corridor-card.revealed .wgl-skill-item {
        animation: wglSubIn 0.40s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        animation-delay: calc(var(--i, 0) * 0.06s + 0.60s);
      }

      .wgl-skill-icon {
        width: 30px; height: 30px;
        border-radius: 8px;
        background: rgba(15, 164, 175, 0.08);
        border: 1px solid rgba(15, 164, 175, 0.14);
        display: flex; align-items: center; justify-content: center;
        font-size: 13px;
        flex-shrink: 0;
      }

      .wgl-skill-info {
        display: flex; flex-direction: column; gap: 4px; flex: 1;
      }

      .wgl-skill-name {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.85);
        font-family: var(--font-display, sans-serif);
      }

      .wgl-skill-bar-track {
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 3px;
        overflow: hidden;
      }

      .wgl-skill-bar-fill {
        height: 100%;
        border-radius: 3px;
        background: linear-gradient(90deg, #0FA4AF, #0c7075);
        width: 0;
        transition: width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      /* Trigger bar animation when parent is revealed */
      .wgl-corridor-card.revealed .wgl-skill-bar-fill {
        width: var(--skill-pct, 70%);
        transition-delay: calc(var(--i, 0) * 0.06s + 0.90s);
      }

      /* ── Shared sub-item entrance ── */
      @keyframes wglSubIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: none; }
      }

      /* ── Mobile — drop perspective, simpler reveal ── */
      @media (max-width: 768px) {
        .wgl-scene { perspective: none; padding: 1rem 1rem 2.5rem; }

        .wgl-corridor-card,
        .wgl-corridor-card.wgl-even {
          transform: translateY(20px) scale(0.98);
        }

        .wgl-corridor-card.revealed {
          transform: translateY(0) scale(1) !important;
        }

        .wgl-bring-grid,
        .wgl-skills-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .wgl-bring-grid { grid-template-columns: 1fr; }
        .wgl-stats { grid-template-columns: repeat(2, 1fr); }
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Build a perspective scene wrapper inside a section ───── */
  function ensureScene(section) {
    let scene = section.querySelector('.wgl-scene');
    if (scene) return scene;

    scene = document.createElement('div');
    scene.className = 'wgl-scene';

    /* Move all existing children (except the canvas) into the scene */
    Array.from(section.children)
      .filter(c => !c.classList.contains('section-webgl-canvas'))
      .forEach(c => scene.appendChild(c));

    section.appendChild(scene);
    return scene;
  }

  /* ── About Section ─────────────────────────────────────────── */
  function initAbout() {
    const section = document.getElementById('about');
    if (!section) return;

    /* Keep constellation as faint background */
    initConstellationBg(section);

    const scene = ensureScene(section);

    /* ── Card 1: About Me ── */
    const aboutCard = createCard('', false);
    aboutCard.querySelector('.wgl-card-head').innerHTML = `
      <div class="wgl-card-icon">👤</div>
      <span class="wgl-card-title">About Me</span>
      <span class="wgl-card-badge">intro</span>
    `;
    aboutCard.querySelector('.wgl-card-body').innerHTML = `
      <div class="wgl-profile-row">
        <div class="wgl-avatar" id="wgl-about-avatar">
          <!--
            To use your own photo replace the emoji below with:
            <img src="Images/your-photo.jpg" alt="Ambel Basha">
          -->
          👤
        </div>
        <div class="wgl-bio">
          <p class="wgl-bio-name">Ambel Basha</p>
          <p class="wgl-bio-role">Full-Stack Developer · Cybersecurity</p>
          <p class="wgl-bio-text">
            <!--
              Replace with your actual bio. Keep it 2–3 sentences:
              who you are, what you build, and what drives you.
            -->
            Passionate developer building full-stack web applications,
            securing systems, and crafting reliable database architectures.
            I bridge clean front-end experiences with robust, secure back-ends —
            and I never stop learning.
          </p>
        </div>
      </div>
      <div class="wgl-stats">
        <div class="wgl-stat" style="--i:0">
          <span class="wgl-stat-num">5+</span>
          <span class="wgl-stat-lbl">Web Projects</span>
        </div>
        <div class="wgl-stat" style="--i:1">
          <span class="wgl-stat-num">3+</span>
          <span class="wgl-stat-lbl">Security Labs</span>
        </div>
        <div class="wgl-stat" style="--i:2">
          <span class="wgl-stat-num">2+</span>
          <span class="wgl-stat-lbl">DB Systems</span>
        </div>
        <div class="wgl-stat" style="--i:3">
          <span class="wgl-stat-num">∞</span>
          <span class="wgl-stat-lbl">Curiosity</span>
        </div>
      </div>
    `;
    scene.insertBefore(aboutCard, scene.firstChild);

    /* ── Card 2: What I Bring ── */
    const bringCard = createCard('wgl-even', false);
    bringCard.querySelector('.wgl-card-head').innerHTML = `
      <div class="wgl-card-icon">⚡</div>
      <span class="wgl-card-title">What I Bring</span>
      <span class="wgl-card-badge">value</span>
    `;
    bringCard.querySelector('.wgl-card-body').innerHTML = `
      <div class="wgl-bring-grid">
        <div class="wgl-bring-card" style="--i:0">
          <div class="wgl-bring-icon">🌐</div>
          <p class="wgl-bring-title">Full-Stack Web Dev</p>
          <p class="wgl-bring-desc">
            End-to-end web solutions — responsive UIs, PHP back-ends,
            MySQL databases, and live deployments on GitHub Pages & InfinityFree.
          </p>
          <div class="wgl-tag-row">
            <span class="wgl-tag">HTML</span>
            <span class="wgl-tag">CSS</span>
            <span class="wgl-tag yellow">JavaScript</span>
            <span class="wgl-tag warm">PHP</span>
          </div>
        </div>
        <div class="wgl-bring-card" style="--i:1">
          <div class="wgl-bring-icon">🔒</div>
          <p class="wgl-bring-title">Security Mindset</p>
          <p class="wgl-bring-desc">
            Hands-on cybersecurity: vulnerability analysis, CVE research,
            network defense, and writing code that's secure by default.
          </p>
          <div class="wgl-tag-row">
            <span class="wgl-tag warm">Kali Linux</span>
            <span class="wgl-tag warm">Wireshark</span>
            <span class="wgl-tag warm">CVE</span>
          </div>
        </div>
        <div class="wgl-bring-card" style="--i:2">
          <div class="wgl-bring-icon">🗄</div>
          <p class="wgl-bring-title">Database Engineering</p>
          <p class="wgl-bring-desc">
            Relational schema design, query optimisation, and real-world
            data modelling with MySQL and phpMyAdmin.
          </p>
          <div class="wgl-tag-row">
            <span class="wgl-tag warm">MySQL</span>
            <span class="wgl-tag">SQL</span>
            <span class="wgl-tag">phpMyAdmin</span>
          </div>
        </div>
        <div class="wgl-bring-card" style="--i:3">
          <div class="wgl-bring-icon">🐧</div>
          <p class="wgl-bring-title">Linux & Shell</p>
          <p class="wgl-bring-desc">
            Fluent in CLI environments — bash scripting, Linux administration,
            and automating repetitive tasks from the terminal.
          </p>
          <div class="wgl-tag-row">
            <span class="wgl-tag green">Bash</span>
            <span class="wgl-tag green">Linux</span>
            <span class="wgl-tag green">Shell</span>
          </div>
        </div>
      </div>
    `;
    scene.appendChild(bringCard);
  }

  /* ── Skills Section ────────────────────────────────────────── */
  function initSkills() {
    const section = document.getElementById('skills');
    if (!section) return;

    /* Keep pulsing rings as faint background */
    initPulsingBg(section);

    const scene = ensureScene(section);

    const SKILL_CATS = [
      {
        title: 'Front-End', icon: '🎨', even: false,
        items: [
          { name: 'HTML5 / CSS3',       pct: 90 },
          { name: 'JavaScript ES6+',    pct: 82 },
          { name: 'Responsive Design',  pct: 88 },
          { name: 'CSS Animations',     pct: 78 },
        ],
      },
      {
        title: 'Back-End', icon: '⚙️', even: true,
        items: [
          { name: 'PHP',           pct: 80 },
          { name: 'MySQL',         pct: 85 },
          { name: 'REST APIs',     pct: 72 },
          { name: 'phpMyAdmin',    pct: 88 },
        ],
      },
      {
        title: 'Cybersecurity', icon: '🔒', even: false,
        items: [
          { name: 'Network Analysis',         pct: 75 },
          { name: 'Vulnerability Assessment', pct: 70 },
          { name: 'Kali Linux',               pct: 72 },
          { name: 'Wireshark',                pct: 68 },
        ],
      },
      {
        title: 'DevOps & Tools', icon: '🔧', even: true,
        items: [
          { name: 'Git / GitHub',   pct: 85 },
          { name: 'Linux CLI',      pct: 80 },
          { name: 'Bash Scripting', pct: 72 },
          { name: 'XAMPP',          pct: 90 },
        ],
      },
    ];

    SKILL_CATS.forEach(cat => {
      const card = createCard(cat.even ? 'wgl-even' : '', false);

      card.querySelector('.wgl-card-head').innerHTML = `
        <div class="wgl-card-icon">${cat.icon}</div>
        <span class="wgl-card-title">${cat.title}</span>
        <span class="wgl-card-badge">skills</span>
      `;

      const itemsHTML = cat.items.map((item, i) => `
        <div class="wgl-skill-item" style="--i:${i}">
          <div class="wgl-skill-icon">${cat.icon}</div>
          <div class="wgl-skill-info">
            <span class="wgl-skill-name">${item.name}</span>
            <div class="wgl-skill-bar-track">
              <div class="wgl-skill-bar-fill"
                   style="--skill-pct:${item.pct}%; --i:${i}">
              </div>
            </div>
          </div>
        </div>
      `).join('');

      card.querySelector('.wgl-card-body').innerHTML = `
        <div class="wgl-skills-grid">${itemsHTML}</div>
      `;

      scene.appendChild(card);
    });
  }

  /* ── Card factory ───────────────────────────────────────────── */
  function createCard(extraClass) {
    const el = document.createElement('div');
    el.className = 'wgl-corridor-card' + (extraClass ? ' ' + extraClass : '');
    el.innerHTML = `<div class="wgl-card-head"></div><div class="wgl-card-body"></div>`;
    return el;
  }

  /* ── Subtle canvas backgrounds ──────────────────────────────── */
  function makeCanvas(parent) {
    const c = document.createElement('canvas');
    c.className = 'section-webgl-canvas';
    c.setAttribute('aria-hidden', 'true');
    parent.insertBefore(c, parent.firstChild);
    return c;
  }

  function initConstellationBg(section) {
    const canvas = makeCanvas(section);
    const ctx    = canvas.getContext('2d');
    let W, H, nodes;

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
      nodes = Array.from({ length: Math.min(28, Math.floor((W * H) / 18000)) }, () => ({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.14, 0.14), vy: rand(-0.14, 0.14),
        r: rand(1, 2),
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      const LINK = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(15,164,175,${(1 - d / LINK) * 0.18})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15,164,175,0.50)';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    tick();
  }

  function initPulsingBg(section) {
    const canvas = makeCanvas(section);
    const ctx    = canvas.getContext('2d');
    let W, H, pts;

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
      pts = Array.from({ length: Math.min(18, Math.floor((W * H) / 22000)) }, () => ({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.10, 0.10), vy: rand(-0.10, 0.10),
        r: rand(1, 2),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.018, 0.035),
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.phase += p.speed;
        const wave = Math.sin(p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 4 + wave * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(15,164,175,${0.10 + wave * 0.04})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15,164,175,0.38)';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    tick();
  }

  /* ── IntersectionObserver — trigger .revealed on scroll ────── */
  function observeCards() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.wgl-corridor-card').forEach(c => io.observe(c));
  }

  /* ── Boot ───────────────────────────────────────────────────── */
  function boot() {
    injectStyles();
    initAbout();
    initSkills();
    /* Wait two rAF frames so injected DOM is laid out before observing */
    requestAnimationFrame(() => requestAnimationFrame(observeCards));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
