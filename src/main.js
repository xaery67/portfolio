import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import './style.css';
import { projects, skills, experiences, educationAndCerts } from './data/projects.js';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

// ==========================================
// 1. RETRO AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playGlitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const freq = 100 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i + 1) * 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + i * 0.04);
      osc.stop(this.ctx.currentTime + (i + 1) * 0.04);
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
    });
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. LIVE CLOCK & STATUS BADGE
// ==========================================
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getMilliseconds() / 100));
    clockEl.textContent = `${hours}:${minutes}:${seconds}.${ms} WIB`;
  }
  setInterval(update, 100);
  update();
}

// ==========================================
// 3. CUSTOM BRUTAL CURSOR
// ==========================================
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.4;
    cursorY += (mouseY - cursorY) * 0.4;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on interactive elements
  const interactiveSelector = 'a, button, input, textarea, .card-brutal, .interactive-tag, select';
  
  function attachHoverListeners() {
    document.querySelectorAll(interactiveSelector).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
      el.addEventListener('click', () => sfx.playClick());
    });
  }
  attachHoverListeners();

  // Expose to window for re-attaching after DOM updates
  window.attachCursorHover = attachHoverListeners;
}

// ==========================================
// 4. PROJECT SHOWCASE RENDERING & FILTERING
// ==========================================
let currentCategory = 'ALL';

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filtered = currentCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category.toUpperCase() === currentCategory.toUpperCase());

  container.innerHTML = filtered.map((proj, idx) => `
    <article class="card-brutal relative flex flex-col justify-between overflow-hidden border-4 border-black ${proj.color} group">
      <!-- Top Meta Bar -->
      <div class="flex items-center justify-between border-b-3 border-black bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-black">
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 border border-black ${idx % 2 === 0 ? 'bg-brutal-green' : 'bg-brutal-pink'}"></span>
          NO. 0${idx + 1} // ${proj.category}
        </span>
        <span class="bg-black px-2 py-0.5 text-white font-mono font-bold">${proj.year}</span>
      </div>

      <!-- Project Thumbnail Preview with Brutal Overlay -->
      <div class="relative overflow-hidden border-b-3 border-black bg-black aspect-video group">
        <img 
          src="${proj.image}" 
          alt="${proj.title}"
          class="h-full w-full object-cover halftone-image filter transition-all duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end pointer-events-none">
          <span class="bg-black/90 px-2 py-1 font-mono text-[11px] font-bold text-brutal-yellow uppercase border border-white/20">
            ${proj.role}
          </span>
          <span class="bg-white px-2 py-1 font-mono text-[10px] font-bold text-black border border-black">
            ★ VERIFIED_DATA
          </span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="flex flex-1 flex-col justify-between p-5 bg-white">
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-sans text-2xl font-black uppercase tracking-tight text-black group-hover:text-brutal-blue transition-colors">
              ${proj.title}
            </h3>
          </div>

          <p class="mt-2 font-mono text-sm leading-relaxed text-zinc-800">
            ${proj.description}
          </p>

          <!-- Impact Metric Badge -->
          <div class="mt-3 border-2 border-black bg-zinc-100 p-2 font-mono text-xs font-bold text-black">
            <span class="text-brutal-pink font-black">▶ DETAIL:</span> ${proj.metrics}
          </div>
        </div>

        <!-- Tags & Actions -->
        <div class="mt-5 pt-3 border-t-2 border-dashed border-zinc-300">
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${proj.tags.map(tag => `
              <span class="border border-black bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-black">
                #${tag}
              </span>
            `).join('')}
          </div>

          <div class="grid grid-cols-2 gap-2">
            <a 
              href="${proj.link}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-brutal-yellow flex items-center justify-center gap-1.5 py-2 text-xs font-mono font-bold"
            >
              <span>VIEW REPO</span>
              <i class="ph-bold ph-arrow-up-right text-base"></i>
            </a>
            <a 
              href="${proj.github}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-brutal flex items-center justify-center gap-1.5 py-2 text-xs font-mono font-bold"
            >
              <i class="ph-bold ph-github-logo text-base"></i>
              <span>SOURCE</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  if (window.attachCursorHover) {
    window.attachCursorHover();
  }
}

function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-black', 'text-white', 'shadow-none');
        b.classList.add('bg-white', 'text-black', 'shadow-brutal');
      });
      btn.classList.remove('bg-white', 'text-black', 'shadow-brutal');
      btn.classList.add('bg-black', 'text-white', 'shadow-none');
      
      currentCategory = btn.getAttribute('data-category');
      renderProjects();
    });
  });
}

// ==========================================
// 5. SKILLS, EXPERIENCE & EDUCATION RENDERING
// ==========================================
function renderSkillsAndExp() {
  // Render Skills
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = skills.map(skill => `
      <div class="interactive-tag group relative flex items-center justify-between border-3 border-black ${skill.color} p-3 shadow-brutal transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg cursor-pointer">
        <span class="font-sans font-bold text-sm tracking-tight text-black">
          ${skill.name}
        </span>
        <span class="border border-black bg-black px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white group-hover:bg-white group-hover:text-black transition-colors">
          ${skill.level}
        </span>
      </div>
    `).join('');
  }

  // Render Experience Timeline
  const expContainer = document.getElementById('experience-container');
  if (expContainer) {
    expContainer.innerHTML = experiences.map((exp, idx) => `
      <div class="relative border-4 border-black bg-white p-5 shadow-brutal transition-all hover:translate-x-1">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
          <span class="bg-brutal-yellow border border-black px-2 py-0.5 font-mono text-xs font-bold text-black">
            ${exp.year}
          </span>
          <span class="font-mono text-xs font-bold text-zinc-500">
            EXP_STAGE_0${idx + 1}
          </span>
        </div>
        <h4 class="mt-3 font-sans text-xl font-black uppercase text-black">
          ${exp.role}
        </h4>
        <p class="font-mono text-xs font-bold text-brutal-blue uppercase">
          @ ${exp.company}
        </p>
        <p class="mt-2 font-mono text-sm leading-relaxed text-zinc-700">
          ${exp.description}
        </p>
      </div>
    `).join('');
  }

  // Render Education & Certifications
  const eduContainer = document.getElementById('education-container');
  if (eduContainer) {
    eduContainer.innerHTML = educationAndCerts.map((edu, idx) => `
      <div class="relative border-4 border-black bg-white p-4 shadow-brutal transition-all hover:translate-x-1">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
          <span class="bg-brutal-cyan border border-black px-2 py-0.5 font-mono text-xs font-bold text-black">
            ${edu.period}
          </span>
          <span class="font-mono text-xs font-bold text-zinc-500">
            CERT_0${idx + 1}
          </span>
        </div>
        <h4 class="mt-2 font-sans text-lg font-black uppercase text-black">
          ${edu.title}
        </h4>
        <p class="font-mono text-xs font-bold text-brutal-pink uppercase">
          ${edu.institution}
        </p>
        <p class="mt-1 font-mono text-xs leading-relaxed text-zinc-700">
          ${edu.detail}
        </p>
      </div>
    `).join('');
  }
}

// ==========================================
// 6. CHAOS / GLITCH EASTER EGG & AUDIO TOGGLE
// ==========================================
function initChaosAndTheme() {
  const chaosBtn = document.getElementById('chaos-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const matrixBtn = document.getElementById('matrix-btn');

  // Chaos Trigger
  if (chaosBtn) {
    chaosBtn.addEventListener('click', () => {
      sfx.playGlitch();
      document.body.classList.toggle('screen-chaos');
      
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF2E93', '#0055FF', '#00E676', '#000000']
      });

      setTimeout(() => {
        document.body.classList.remove('screen-chaos');
      }, 3000);
    });
  }

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      soundToggleBtn.innerHTML = sfx.enabled
        ? `<i class="ph-bold ph-speaker-high text-lg"></i> <span class="hidden sm:inline">AUDIO: ON</span>`
        : `<i class="ph-bold ph-speaker-slash text-lg"></i> <span class="hidden sm:inline">AUDIO: OFF</span>`;
      if (sfx.enabled) sfx.playClick();
    });
  }

  // Theme Invert Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggleBtn.innerHTML = isDark
        ? `<i class="ph-bold ph-sun text-lg text-brutal-yellow"></i> <span class="hidden sm:inline">LIGHT MODE</span>`
        : `<i class="ph-bold ph-moon text-lg"></i> <span class="hidden sm:inline">INVERT</span>`;
      localStorage.setItem('brutal-theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('brutal-theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = `<i class="ph-bold ph-sun text-lg text-brutal-yellow"></i> <span class="hidden sm:inline">LIGHT MODE</span>`;
    }
  }

  // Confetti Blast Button
  if (matrixBtn) {
    matrixBtn.addEventListener('click', () => {
      sfx.playSuccess();
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    });
  }
}

// ==========================================
// 7. CONTACT FORM SUBMISSION
// ==========================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('brutal-toast');
  const toastMsg = document.getElementById('toast-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const msgInput = document.getElementById('sender-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
      alert('ERROR: ALL FIELDS ARE MANDATORY IN BRUTAL PROTOCOL.');
      return;
    }

    sfx.playSuccess();
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 }
    });

    // Show Brutal Toast
    if (toast && toastMsg) {
      toastMsg.textContent = `TRANSMISSION SENT! THANK YOU ${nameInput.value.toUpperCase()}.`;
      toast.classList.remove('hidden');
      gsap.fromTo(toast, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });

      setTimeout(() => {
        gsap.to(toast, { y: 50, opacity: 0, duration: 0.3, onComplete: () => toast.classList.add('hidden') });
      }, 5000);
    }

    form.reset();
  });
}

// ==========================================
// 8. INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCustomCursor();
  renderProjects();
  initCategoryFilters();
  renderSkillsAndExp();
  initChaosAndTheme();
  initContactForm();

  console.log("%c★ FERY ADI WIBOWO PORTFOLIO INITIALIZED ★", "background: #FFE600; color: #000; font-size: 16px; font-weight: bold; padding: 4px 8px; border: 2px solid black;");
});