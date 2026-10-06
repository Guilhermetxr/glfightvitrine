// Contatos da atleta. Campos vazios mantêm o botão escondido.
// instagram: 'https://www.instagram.com/usuario/'  ·  whatsapp: só números com DDI, ex. '5598999999999'
export const perfil = {
  instagram: '',
  whatsapp: '',
  mensagemWhatsapp: 'Oi, Géssica! Vi seu site e quero saber mais sobre as aulas de Muay Thai.'
};

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const isMobile = () => innerWidth <= 700;
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/* ---------- contatos ---------- */
try {
  const url = new URL(perfil.instagram);
  if (url.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(url.hostname)) {
    const link = document.querySelector('#instagramAtleta'); link.href = url.href; link.hidden = false;
  }
} catch { /* Instagram ainda não informado. */ }
if (/^\d{12,13}$/.test(perfil.whatsapp)) {
  const link = document.querySelector('#whatsAtleta');
  link.href = `https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(perfil.mensagemWhatsapp)}`;
  link.hidden = false;
}
document.querySelector('#ano').textContent = new Date().getFullYear();

// Em desenvolvimento, a loja roda em outra porta.
if (['localhost', '127.0.0.1'].includes(location.hostname)) {
  document.querySelectorAll('a[href="../GLfight/index.html"]').forEach(link => { link.href = 'http://localhost:5173/index.html'; });
}

/* ---------- split de letras (hero) e palavras (manifesto) ---------- */
let charIndex = 0;
document.querySelectorAll('[data-split]').forEach(line => {
  const text = line.textContent;
  line.textContent = '';
  line.setAttribute('aria-hidden', 'true');
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char'; span.textContent = ch; span.style.setProperty('--i', charIndex++);
    line.append(span);
  }
});

const words = [];
document.querySelectorAll('[data-words]').forEach(el => {
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span'); w.className = 'word'; w.textContent = part; words.push(w); frag.append(w);
        });
        child.replaceWith(frag);
      } else walk(child);
    });
  };
  walk(el);
});

/* ---------- entrada ---------- */
const start = () => requestAnimationFrame(() => document.body.classList.add('is-loaded'));
if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
setTimeout(start, 2500); // não segura a página se alguma imagem demorar

/* ---------- reveal ao rolar ---------- */
const revealer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    revealer.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: .1 });
document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));

function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) { el.textContent = target; return; }
  const t0 = performance.now();
  const tick = now => {
    const p = clamp((now - t0) / 1200);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- header: fundo ao rolar, esconde descendo ---------- */
const header = document.querySelector('.header');
let lastY = scrollY;

/* ---------- menu mobile ---------- */
const toggle = document.querySelector('.menu-toggle');
const setMenu = open => {
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- link ativo no menu ---------- */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* ---------- vídeo da vitória ---------- */
const video = document.querySelector('.moment-video');
const playBtn = document.querySelector('[data-video="play"]');
const soundBtn = document.querySelector('[data-video="sound"]');
let userPaused = false;

const syncButtons = () => {
  playBtn.textContent = video.paused ? 'Assistir' : 'Pausar';
  playBtn.setAttribute('aria-pressed', String(video.paused));
  soundBtn.textContent = video.muted ? 'Ativar som' : 'Som ligado';
  soundBtn.setAttribute('aria-pressed', String(!video.muted));
};
const tryPlay = () => video.play().catch(() => {}).finally(syncButtons);

new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    if (video.preload === 'none') { video.preload = 'auto'; video.load(); }
    if (!userPaused && !reduceMotion) tryPlay();
  } else {
    video.pause(); syncButtons();
  }
}, { threshold: .35 }).observe(video);

playBtn.addEventListener('click', () => {
  if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); syncButtons(); }
});
soundBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  if (!video.muted) { userPaused = false; if (video.currentTime > 1 && video.paused) video.currentTime = 0; tryPlay(); }
  syncButtons();
});
video.addEventListener('click', () => playBtn.click());
syncButtons();
if (reduceMotion) playBtn.textContent = 'Assistir';

/* ---------- galeria + lightbox ---------- */
const gallery = document.querySelector('.gallery');
const track = document.querySelector('.gallery-track');
const shots = [...document.querySelectorAll('.shot[data-full]')];
const dialog = document.querySelector('.lightbox');
const lbImg = dialog.querySelector('img');
const lbCap = dialog.querySelector('figcaption');
let current = 0;

const showShot = i => {
  current = (i + shots.length) % shots.length;
  const shot = shots[current];
  lbImg.src = shot.dataset.full;
  lbImg.alt = shot.querySelector('img').alt;
  lbCap.textContent = shot.dataset.caption;
};
shots.forEach((shot, i) => shot.addEventListener('click', () => { showShot(i); dialog.showModal(); }));
dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.lb-prev').addEventListener('click', () => showShot(current - 1));
dialog.querySelector('.lb-next').addEventListener('click', () => showShot(current + 1));
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') showShot(current + 1);
  if (e.key === 'ArrowLeft') showShot(current - 1);
});

// Altura da seção = distância horizontal a percorrer, para o scroll vertical "empurrar" a faixa.
const horizontalGallery = () => !reduceMotion && !isMobile();
const sizeGallery = () => {
  if (!horizontalGallery()) { gallery.style.height = ''; track.style.transform = ''; return; }
  const distance = Math.max(0, track.scrollWidth - innerWidth);
  gallery.style.height = `${innerHeight + distance}px`;
};

/* ---------- loop de scroll (um rAF para tudo) ---------- */
const moment = document.querySelector('.moment');
const manifesto = document.querySelector('.manifesto');
const timeline = document.querySelector('.timeline');
const timelineBar = document.querySelector('.timeline-progress');
const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
const marquees = [...document.querySelectorAll('[data-marquee]')].map(row => ({
  row, track: row.querySelector('.marquee-track'), dir: Number(row.dataset.marquee), x: 0
}));

// Duplica o conteúdo do marquee para o loop ficar contínuo.
marquees.forEach(m => {
  const original = m.track.innerHTML;
  m.track.innerHTML = original.repeat(4);
  m.unit = () => m.track.scrollWidth / 4;
});

const progressOf = (el, startOffset = 0, endOffset = 0) => {
  const r = el.getBoundingClientRect();
  const total = r.height - innerHeight + startOffset + endOffset;
  return clamp((-r.top + startOffset) / (total || 1));
};

let ticking = false;
let velocity = 0;
const onScroll = () => {
  const y = scrollY;
  velocity = y - lastY;

  header.classList.toggle('is-scrolled', y > 40);
  header.classList.toggle('is-hidden', y > 500 && velocity > 4 && !document.body.classList.contains('menu-open'));
  if (velocity < -4) header.classList.remove('is-hidden');
  lastY = y;

  if (reduceMotion) return;

  if (!isMobile()) moment.style.setProperty('--p', progressOf(moment, 0, -innerHeight * .35).toFixed(4));

  if (horizontalGallery()) {
    const p = progressOf(gallery);
    track.style.transform = `translate3d(${-p * Math.max(0, track.scrollWidth - innerWidth)}px,0,0)`;
  }

  // Manifesto: as palavras acendem conforme a seção atravessa a tela.
  const mr = manifesto.getBoundingClientRect();
  const mp = clamp((innerHeight * .9 - mr.top) / (mr.height * .5 + innerHeight * .4));
  words.forEach((w, i) => w.style.setProperty('--o', clamp(mp * (words.length + 2) - i, .14, 1).toFixed(3)));

  const tr = timeline.getBoundingClientRect();
  timelineBar.style.setProperty('--tp', clamp((innerHeight * .6 - tr.top) / tr.height).toFixed(4));

  parallaxEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const offset = (r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.parallax);
    const img = el.querySelector('img');
    img.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
  });
};

addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); ticking = false; });
}, { passive: true });

// Marquee contínuo; acelera com a velocidade do scroll.
if (!reduceMotion) {
  let boost = 0;
  const loop = () => {
    boost += (Math.abs(velocity) * .25 - boost) * .08;
    velocity *= .9;
    marquees.forEach(m => {
      const unit = m.unit();
      m.x -= (0.6 + boost) * m.dir;
      if (m.x <= -unit) m.x += unit;
      if (m.x > 0) m.x -= unit;
      m.track.style.transform = `translate3d(${m.x}px,0,0)`;
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

addEventListener('resize', () => { sizeGallery(); onScroll(); });
addEventListener('load', () => { sizeGallery(); onScroll(); });
sizeGallery(); onScroll();

/* ---------- interações de ponteiro (desktop) ---------- */
if (finePointer && !reduceMotion) {
  // Cursor com atraso suave
  const cursor = document.querySelector('.cursor');
  let cx = -100, cy = -100, tx = -100, ty = -100;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  const follow = () => {
    cx += (tx - cx) * .2; cy += (ty - cy) * .2;
    cursor.style.setProperty('--cx', `${cx}px`); cursor.style.setProperty('--cy', `${cy}px`);
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);
  document.addEventListener('pointerover', e => cursor.classList.toggle('is-hover', !!e.target.closest('a, button')));

  // Botões magnéticos
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * .18}px`);
      btn.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * .3}px`);
    });
    btn.addEventListener('pointerleave', () => { btn.style.setProperty('--bx', '0px'); btn.style.setProperty('--by', '0px'); });
  });

  // Cards com inclinação 3D e brilho seguindo o mouse
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', `${(px - .5) * 6}deg`);
      card.style.setProperty('--rx', `${(.5 - py) * 6}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });
}
