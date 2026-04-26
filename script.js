/* ===========================
   script.js — Anthurium Farming Website
   =========================== */

// Expose navigateTo globally so onclick= attributes in HTML can call it
window.navigateTo = function(pageId) {
  const pages    = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');

  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(animateCards, 150);

  const navLinksEl = document.getElementById('navLinks');
  if (navLinksEl) navLinksEl.classList.remove('open');
};

// ─── Download toast — global ──────────────────────────────────────
let toastTimer = null;

window.handleDownload = function(e, fileName) {
  e.preventDefault();
  showToast('"' + fileName + '" — replace href with your file link.');
};

window.sendMessage = function() {
  const name    = (document.getElementById('cf-name')?.value    || '').trim();
  const email   = (document.getElementById('cf-email')?.value   || '').trim();
  const subject = (document.getElementById('cf-subject')?.value || '').trim();
  const message = (document.getElementById('cf-message')?.value || '').trim();

  if (!name || !email || !message) {
    showToast('Please fill in your name, email, and message.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.');
    return;
  }

  window.location.href =
    'mailto:anthurium.research@my.sliit.lk' +
    '?subject=' + encodeURIComponent(subject || 'Project Inquiry') +
    '&body='    + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

  showToast('Opening your email client…');
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  const span  = document.getElementById('toast-msg');
  if (!toast || !span) return;
  span.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Card animations ──────────────────────────────────────────────
function animateCards() {
  document.querySelectorAll('.card-animate:not(.visible)').forEach(card => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { card.classList.add('visible'); obs.disconnect(); }
      });
    }, { threshold: 0.1 }).observe(card);
  });
}

// ─── Hero particles ───────────────────────────────────────────────
function createParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText =
      'left:'               + (Math.random() * 100)    + '%;' +
      'bottom:'             + (Math.random() * 30)     + '%;' +
      'width:'              + (Math.random() * 3 + 2)  + 'px;' +
      'height:'             + (Math.random() * 3 + 2)  + 'px;' +
      'animation-duration:' + (Math.random() * 10 + 8) + 's;' +
      'animation-delay:'    + (Math.random() * 10)     + 's;';
    c.appendChild(p);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Wire nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Hamburger
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksEl.contains(e.target))
        navLinksEl.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') navLinksEl.classList.remove('open');
    });
  }

  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Watch page class changes to re-trigger card animations
  document.querySelectorAll('.page').forEach(page => {
    new MutationObserver(() => setTimeout(animateCards, 150))
      .observe(page, { attributes: true, attributeFilter: ['class'] });
  });

  createParticles();

  // Start on home
  navigateTo('home');
});
