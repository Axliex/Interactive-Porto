/* HARNESS FULL DEMO (sementara — hapus setelah demo selesai).
 * Menjalankan App asli lalu "mengklik" seluruh alur secara berurutan.
 * ?step=N → menjalankan tahap 1..N lalu membekukan animasi untuk screenshot.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { soundTrack } from './utils/audioSynth';
import { SCREEN_RECTS } from './data/screensLayout';
import './styles/index.css';

// Headless tanpa perangkat audio: sintesis suara tidak boleh menggagalkan klik pertama.
try {
  soundTrack.play = () => {};
} catch {
  /* noop */
}

const params = new URLSearchParams(location.search);
const showBadge = params.get('badge') !== '0';

// Badge debug (untuk QA): membuktikan kapan & dalam state apa screenshot diambil.
const badge = document.createElement('div');
badge.style.cssText =
  'position:fixed;right:8px;bottom:8px;z-index:99999;background:rgba(0,0,0,.8);' +
  'color:#4ade80;font:12px/1.45 monospace;padding:4px 7px;border-radius:4px;' +
  'pointer-events:none;white-space:pre;text-align:right';
badge.textContent = 'boot';
document.body.appendChild(badge);
if (!showBadge) badge.style.display = 'none';

const detectState = () => {
  if (document.querySelector('.intro-circle-btn')) return 'INTRO';
  const back = document.querySelector('button[aria-label^="Kembali ke tampilan"]');
  if (back) {
    return back.getAttribute('aria-label').includes('Hero') ? 'OBJECT' : 'DETAIL';
  }
  if (document.querySelector('[aria-label^="Navigasi ke"]')) return 'HERO';
  return '?';
};
const refreshBadge = (stageName, stepNo) => {
  if (!showBadge) return;
  badge.textContent =
    `#${stepNo} ${stageName}\n` +
    `vt=${Math.round(performance.now())}ms  state=${detectState()}\n` +
    `last=${log[log.length - 1] || '-'}  miss=${missing.length}`;
};

const metric = document.createElement('span');
metric.id = 'metric';
metric.style.display = 'none';
document.body.appendChild(metric);

const log = [];
const missing = [];

const click = (sel, label) => {
  const el = typeof sel === 'function' ? sel() : document.querySelector(sel);
  if (!el) {
    missing.push(label || String(sel));
    return false;
  }
  el.click();
  log.push(label || String(sel));
  return true;
};
const clickText = (text) => {
  const el = [...document.querySelectorAll('button')].find((b) =>
    b.textContent.includes(text)
  );
  if (!el) {
    missing.push('text:' + text);
    return false;
  }
  el.click();
  log.push('text:' + text);
  return true;
};
const hotspot = (name) => `button[aria-label="Navigasi ke ${name}"]`;

// Transisi antar scene memakai video; di headless dipaksa selesai manual.
const forceEnded = () => {
  const v = document.querySelector('video');
  if (!v) {
    log.push('no-video(maybe-already-ended)');
    return;
  }
  try {
    v.pause();
  } catch {
    /* noop */
  }
  try {
    if (Number.isFinite(v.duration) && v.duration > 0) v.currentTime = v.duration;
  } catch {
    /* noop */
  }
  v.dispatchEvent(new Event('ended', { bubbles: true }));
  log.push('video-ended');
};

// Pusatkan viewport pada kanvas 16:9 (tanpa smooth scroll).
const center = () => {
  const el = document.querySelector('div.no-scrollbar.overflow-x-auto');
  if (!el) {
    missing.push('scroller');
    return;
  }
  el.scrollTo({ left: (el.scrollWidth - el.clientWidth) / 2, behavior: 'instant' });
};

const hoverIntro = () => {
  const b = document.querySelector('.intro-circle-btn');
  if (!b) {
    missing.push('intro-circle');
    return;
  }
  b.focus();
  b.dispatchEvent(
    new PointerEvent('pointerover', { bubbles: true, pointerId: 1, isPrimary: true })
  );
  log.push('hover-intro');
};

// ---------------- Timeline per tahap ----------------
const STAGES = [
  { name: '01-intro', dur: 600, acts: [] },
  {
    name: '02-intro-hover',
    dur: 3200,
    acts: [[200, hoverIntro]],
  },
  {
    name: '03-desk-hero',
    dur: 1500,
    acts: [
      [300, () => click('.intro-circle-btn', 'mulai')],
      [900, forceEnded],
      [1100, center],
    ],
  },
  {
    name: '04-monitor-choice',
    dur: 1500,
    acts: [
      [300, () => click(hotspot('Web Development and UI Design'), 'hotspot-PC')],
      [900, forceEnded],
      [1100, center],
    ],
  },
  {
    name: '05-monitor-preview',
    dur: 900,
    acts: [
      [
        300,
        () => click('button[aria-label="Pilih kategori Web Development"]', 'kategori-webdev'),
      ],
    ],
  },
  {
    name: '06-monitor-next',
    dur: 900,
    acts: [[300, () => click('button[aria-label="Proyek berikutnya"]', 'panah-kanan')]],
  },
  {
    name: '07-back-hero-1',
    dur: 1500,
    acts: [
      [300, () => click('button[aria-label="Kembali ke tampilan Hero utama"]', 'back-hero')],
      [900, forceEnded],
      [1100, center],
    ],
  },
  {
    name: '08-paper',
    dur: 1500,
    acts: [
      [300, () => click(hotspot('Profile & Resume'), 'hotspot-Paper')],
      [900, forceEnded],
      [1100, center],
    ],
  },
  {
    name: '09-paper-detail',
    dur: 1300,
    acts: [[300, () => clickText('About Me')]],
  },
  {
    name: '10-phone-profile',
    dur: 3100,
    acts: [
      [300, () => click('button[aria-label="Kembali ke tampilan Paper"]', 'back-obj')],
      [900, () => click('button[aria-label="Kembali ke tampilan Hero utama"]', 'back-hero')],
      [1500, forceEnded],
      [1700, center],
      [1900, () => click(hotspot('Socials Design'), 'hotspot-Phone')],
      [2500, forceEnded],
      [2700, center],
    ],
  },
  {
    name: '11-phone-accounts',
    dur: 800,
    acts: [[300, () => click('button[aria-label="Cari dan ganti akun"]', 'cari-akun')]],
  },
  {
    name: '12-phone-feed-slide',
    dur: 1600,
    acts: [
      [300, () => click('button[aria-label="Kembali ke beranda profil"]', 'back-profile')],
      [700, () => click('button[title="Editorial & Merchandise"]', 'post-4')],
      [1100, () => click('button[aria-label="Slide berikutnya"]', 'slide-kanan')],
    ],
  },
  {
    name: '13-back-hero-2',
    dur: 1900,
    acts: [
      [300, () => click('button[aria-label="Kembali ke beranda profil"]', 'back-profile')],
      [700, () => click('button[aria-label="Kembali ke tampilan Hero utama"]', 'back-hero')],
      [1300, forceEnded],
      [1500, center],
    ],
  },
  {
    name: '14-book-detail',
    dur: 3200,
    acts: [
      [300, () => click(hotspot('Book of Books'), 'hotspot-Book')],
      [900, forceEnded],
      [1100, center],
      [1400, () => clickText('Lihat Detail Proyek')],
    ],
  },
  {
    name: '15-book-flip',
    dur: 1200,
    acts: [
      [300, () => click('button[aria-label="Balik ke halaman berikutnya"]', 'flip-berikut')],
    ],
  },
  {
    name: '16-book-sticky',
    dur: 900,
    acts: [
      [
        300,
        () => {
          const notes = document.querySelectorAll(
            '[aria-label="Pilih proyek buku"] [role="tab"]'
          );
          if (!notes.length) {
            missing.push('sticky-notes');
            return;
          }
          (notes[2] || notes[0]).click();
          log.push('sticky-note');
        },
      ],
    ],
  },
  {
    name: '17-bike-modal',
    // back dari detail Book: handleBack (450ms) → bookLift down (700+80ms) →
    // overlay baru muncul ±1530ms, jadi back-hero baru diklik di 1700ms.
    dur: 4700,
    acts: [
      [300, () => click('button[aria-label="Kembali ke tampilan Book"]', 'back-obj-book')],
      [1700, () => click('button[aria-label="Kembali ke tampilan Hero utama"]', 'back-hero')],
      [2300, forceEnded],
      [2500, center],
      [2700, () => click(hotspot('Cycling Journey'), 'hotspot-Bike')],
      [3300, forceEnded],
      [3500, center],
      [3800, () => clickText('Lihat Perjalanan')],
    ],
  },
  {
    name: '18-turntable',
    dur: 3200,
    acts: [
      [300, () => click('button[aria-label="Tutup Jurnal Perjalanan"]', 'tutup-bike')],
      [800, () => click('button[aria-label="Kembali ke tampilan Hero utama"]', 'back-hero')],
      [1400, forceEnded],
      [1600, center],
      [1800, () => click(hotspot('Turntable'), 'hotspot-Turntable')],
      [2400, forceEnded],
      [2600, center],
    ],
  },
];

// Stempel waktu lahir tiap cincin gelombang (jam CSS tidak maju di virtual time).
new MutationObserver((muts) => {
  muts.forEach((m) =>
    m.addedNodes.forEach((n) => {
      if (n.nodeType === 1 && n.classList && n.classList.contains('intro-wave')) {
        n.dataset.born = String(performance.now());
      }
    })
  );
}).observe(document.body, { childList: true, subtree: true });

const freeze = () => {
  const now = performance.now();
  document.getAnimations().forEach((a) => {
    const el = a.effect && a.effect.target;
    const isWave = !!(el && el.classList && el.classList.contains('intro-wave'));
    const timing = a.effect.getTiming();
    a.pause();
    if (isWave) {
      const born = Number(el.dataset.born || now);
      a.currentTime = Math.min(Math.max(now - born, 0), 5000);
    } else if (timing.iterations === Infinity) {
      a.currentTime = 1200;
    } else {
      a.currentTime =
        (timing.delay || 0) + (typeof timing.duration === 'number' ? timing.duration : 0);
    }
  });
};

createRoot(document.getElementById('root')).render(<App />);

// ---------------- Driver ----------------
const step = Math.max(1, Math.min(STAGES.length, Number(params.get('step') || 1)));
let clock = 0;
for (let i = 0; i < step; i += 1) {
  const s = STAGES[i];
  s.acts.forEach(([t, fn]) => setTimeout(fn, clock + t));
  clock += s.dur;
}

setInterval(() => refreshBadge(STAGES[step - 1].name, step), 50);
refreshBadge(STAGES[step - 1].name, step);

setTimeout(() => {
  freeze();
  const pcView = document.querySelector('[data-pc-view]');
  metric.textContent = JSON.stringify({
    step,
    name: STAGES[step - 1].name,
    log,
    missing,
    rings: document.querySelectorAll('.intro-wave').length,
    pc: pcView
      ? `${pcView.getAttribute('data-pc-view')}/${pcView.getAttribute('data-pc-cat')}/${
          pcView.getAttribute('data-pc-index') || '0'
        }`
      : null,
    video: !!document.querySelector('video'),
    detail: !!document.querySelector('button[aria-label^="Kembali ke tampilan"]'),
    dom: measureDom(),
  });
  if (params.get('diag') === '1') showDiag();
}, clock + 120);

// Overlay diag (?diag=1): cetak hasil ukuran DOM besar-besar supaya terbaca di screenshot
// (karena --dump-dom crash di environment ini).
function showDiag() {
  const dom = measureDom();
  const box = document.createElement('div');
  box.style.cssText =
    'position:fixed;left:0;top:0;right:0;background:#fff;color:#000;' +
    'font:18px/1.55 monospace;padding:12px 16px;z-index:999999;white-space:pre';
  box.textContent = [
    `step=${step} ${STAGES[step - 1].name} vt=${Math.round(performance.now())}`,
    dom
      ? `key=${dom.key} rect=${dom.rect.left},${dom.rect.top},${dom.rect.width},${dom.rect.height}`
      : 'dom=null',
    dom ? `host=${dom.host.left},${dom.host.top},${dom.host.width},${dom.host.height}` : '',
    dom ? `panel=${dom.panel.left},${dom.panel.top},${dom.panel.width},${dom.panel.height}` : '',
    dom && dom.scene ? `scene=${dom.scene.left},${dom.scene.top},${dom.scene.width},${dom.scene.height}` : '',
    dom && dom.sceneImg ? `img=${dom.sceneImg.left},${dom.sceneImg.top},${dom.sceneImg.width},${dom.sceneImg.height}` : '',
    dom ? `src=${dom.src} imgOp=${dom.imgOp}` : '',
    dom ? `vidSrc=${dom.vidSrc} vidOp=${dom.vidOp} t=${dom.vidT}` : '',
    dom ? `dpr=${dom.dpr} inner=${dom.inner[0]}x${dom.inner[1]}` : '',
    `missing=${JSON.stringify(missing)}`,
    // Rect tombol nav hero — untuk memastikan tidak ada yang terpotong viewport.
    (() => {
      const navs = [...document.querySelectorAll('[aria-label^="Navigasi ke"]')];
      if (!navs.length) return 'navs=-';
      return (
        'navs=' +
        navs
          .map((el) => {
            const r = el.getBoundingClientRect();
            return `${el.getAttribute('aria-label').slice(11, 17)}:${Math.round(r.left)}..${Math.round(r.right)}`;
          })
          .join(' ')
      );
    })(),
    `scrollLeft=${(() => {
      const sc = document.querySelector('div.no-scrollbar');
      return sc ? `${sc.scrollLeft} sw=${sc.scrollWidth} cw=${sc.clientWidth}` : '-';
    })()}`,
  ].join('\n');
  document.body.appendChild(box);

  // Beacon teks diag ke listener lokal (hindari read screenshot yang stale)
  try {
    const b = new Image();
    b.src = 'http://localhost:8099/d?t=' + encodeURIComponent(box.textContent);
  } catch (e) {
    /* noop */
  }

  // Grid 5% tepat di atas scene canvas (koordinat yang dipakai SCREEN_RECTS)
  // + outline panel saat ini, supaya tepi objek bisa dibaca langsung dalam %.
  const scene = document.querySelector('img[alt="Desk Scene"]');
  const scr = document.querySelector(
    '.screen-ui-paper, .screen-ui-phone, .screen-ui-monitor'
  );
  const panel = scr && scr.parentElement;
  if (panel) panel.style.outline = '4px solid #00ffff';
  const host = panel && panel.parentElement;
  if (host) {
    // Grid menempel pada host lewat CSS (viewBox %, inset:0) — ikut layout
    // berapa pun ukuran host saat screenshot diambil (bukan posisi hasil JS).
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute(
      'style',
      'position:absolute;left:0;top:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:999997;overflow:visible'
    );
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    let html = '';
    for (let i = 0; i <= 20; i++) {
      const p = i * 5;
      const major = i % 2 === 0;
      const col = major ? '#ff00ff' : 'rgba(255,60,60,0.75)';
      const w = major ? 3 : 2;
      html +=
        `<line x1="${p}" y1="0" x2="${p}" y2="100" stroke="${col}" ` +
        `stroke-width="${w}" vector-effect="non-scaling-stroke"/>` +
        `<line x1="0" y1="${p}" x2="100" y2="${p}" stroke="${col}" ` +
        `stroke-width="${w}" vector-effect="non-scaling-stroke"/>`;
    }
    svg.innerHTML = html;
    host.appendChild(svg);

    // Beacon ulang 150ms kemudian: menangkap layout setelah resize window.
    setTimeout(() => {
      const b = host.getBoundingClientRect();
      const p2 = panel.getBoundingClientRect();
      const img2 = document.querySelector('img[alt="Desk Scene"]');
      const ib = img2 ? img2.getBoundingClientRect() : null;
      try {
        const b2 = new Image();
        b2.src =
          'http://localhost:8099/d?t=' +
          encodeURIComponent(
            `LATE step=${step} host=${b.left.toFixed(1)},${b.top.toFixed(1)},` +
              `${b.width.toFixed(1)},${b.height.toFixed(1)} panel=` +
              `${p2.left.toFixed(1)},${p2.top.toFixed(1)},${p2.width.toFixed(1)},${p2.height.toFixed(1)} ` +
              (ib
                ? `img=${ib.left.toFixed(1)},${ib.top.toFixed(1)},${ib.width.toFixed(1)},${ib.height.toFixed(1)} `
                : '') +
              `inner=${window.innerWidth}x${window.innerHeight}`
          );
      } catch (e) {
        /* noop */
      }
    }, 150);
  }
}

// Ukur host kanvas + panel layar objek (untuk kalibrasi SCREEN_RECTS).
function measureDom() {
  const scr = document.querySelector('.screen-ui-paper, .screen-ui-phone, .screen-ui-monitor');
  if (!scr) return null;
  const panel = scr.parentElement;
  const host = panel && panel.parentElement;
  if (!panel || !host) return null;
  const r = (el) => {
    const b = el.getBoundingClientRect();
    return {
      left: +b.left.toFixed(1),
      top: +b.top.toFixed(1),
      width: +b.width.toFixed(1),
      height: +b.height.toFixed(1),
    };
  };
  const key = scr.classList.contains('screen-ui-paper')
    ? 'Paper'
    : scr.classList.contains('screen-ui-phone')
      ? 'Phone'
      : 'PC';
  const scene = document.querySelector('img[alt="Desk Scene"]');
  const vid = document.querySelector('video');
  return {
    key,
    rect: SCREEN_RECTS[key],
    host: r(host),
    panel: r(panel),
    scene: scene ? r(scene.parentElement) : null,
    sceneImg: scene ? r(scene) : null,
    src: scene ? scene.getAttribute('src') : null,
    imgOp: scene ? getComputedStyle(scene).opacity : null,
    vidSrc: vid ? vid.getAttribute('src') : null,
    vidOp: vid ? getComputedStyle(vid).opacity : null,
    vidT: vid
      ? `${Math.round((vid.currentTime || 0) * 100) / 100}/${vid.duration ?? '?'}`
      : null,
    dpr: window.devicePixelRatio,
    inner: [window.innerWidth, window.innerHeight],
  };
}
