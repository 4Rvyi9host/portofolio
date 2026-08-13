/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Author : Muhammad Ar Rafi Saifuddin
   Stack  : Vanilla JavaScript (ES6+, no dependencies)
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════
   UTILITY HELPERS
═══════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════
   1. LUCIDE ICONS INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ═══════════════════════════════════════════
   2. FOOTER YEAR
═══════════════════════════════════════════ */
const footerYear = $('#footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   3. THEME TOGGLE (Dark / Light)
═══════════════════════════════════════════ */
(function initTheme() {
  const html        = document.documentElement;
  const toggleBtn   = $('#theme-toggle');
  const STORAGE_KEY = 'portfolio-theme';

  // Restore saved or system preference
  const saved    = localStorage.getItem(STORAGE_KEY);
  const sysDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial  = saved || (sysDark ? 'dark' : 'light');
  html.setAttribute('data-theme', initial);

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
      toggleBtn.setAttribute('title',       theme === 'dark' ? 'Mode terang' : 'Mode gelap');
    }
  }

  applyTheme(initial);

  toggleBtn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
    // Re-init icons after theme swap (color changes)
    window.lucide?.createIcons();
  });
})();

/* ═══════════════════════════════════════════
   4. NAVBAR — scroll behaviour + active link
═══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Transparent → Solid on scroll
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlighting via IntersectionObserver
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    });
  }, {
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72}px 0px -60% 0px`,
    threshold: 0,
  });

  sections.forEach(sec => observer.observe(sec));
})();

/* ═══════════════════════════════════════════
   5. MOBILE HAMBURGER MENU
═══════════════════════════════════════════ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#nav-links');
  if (!hamburger || !navLinks) return;

  const toggle = (force) => {
    const isOpen = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle());

  // Close on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();

/* ═══════════════════════════════════════════
   6. TYPING / TYPEWRITER EFFECT
═══════════════════════════════════════════ */
(function initTyping() {
  const el = $('#typing-text');
  if (!el) return;

  const phrases = [
    'Mahasiswa Sistem Informasi',
    'IT Support Enthusiast',
    'Database Administrator',
    'UI/UX Enthusiast',
    'Data Mining Researcher',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let timer;

  const TYPE_SPEED   = 80;   // ms per char typed
  const DELETE_SPEED = 45;   // ms per char deleted
  const PAUSE_AFTER  = 2000; // ms to wait at full word
  const PAUSE_EMPTY  = 400;  // ms to wait at empty

  function tick() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        timer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
      timer = setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        timer = setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      timer = setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after short delay
  timer = setTimeout(tick, 800);
})();

/* ═══════════════════════════════════════════
   7. SCROLL ANIMATIONS (Intersection Observer)
═══════════════════════════════════════════ */
(function initScrollAnimations() {
  const animated = $$('[data-animate]');
  if (!animated.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('animated');
        observer.unobserve(el);
      }, delay);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  animated.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════
   8. EXPERIENCE TAB SWITCHER
═══════════════════════════════════════════ */
(function initTabs() {
  const tabs   = $$('.tab-btn');
  const panels = $$('.timeline-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update buttons
      tabs.forEach(t => {
        t.classList.toggle('tab-btn--active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      // Update panels
      panels.forEach(panel => {
        const match = panel.id === `panel-${target}`;
        panel.classList.toggle('timeline-panel--hidden', !match);

        // Re-trigger animations in newly-shown panel
        if (match) {
          $$('[data-animate]', panel).forEach(el => {
            if (!el.classList.contains('animated')) return;
            // Reset and replay
            el.classList.remove('animated');
            setTimeout(() => el.classList.add('animated'), 50);
          });
        }
      });
    });
  });
})();

/* ═══════════════════════════════════════════
   9. CONTACT FORM VALIDATION
═══════════════════════════════════════════ */
(function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  // ── Helpers ────────────────────────────────
  const showError = (inputId, message) => {
    const input = $(`#${inputId}`, form);
    const error = $(`#${inputId}-error`, form);
    if (!input || !error) return;
    input.classList.add('error');
    error.textContent = message;
  };

  const clearError = (inputId) => {
    const input = $(`#${inputId}`, form);
    const error = $(`#${inputId}-error`, form);
    if (!input || !error) return;
    input.classList.remove('error');
    error.textContent = '';
  };

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ── Live validation (on blur) ───────────────
  const inputs = $$('.form-input', form);
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  function validateField(input) {
    const { id, name, value } = input;
    const v = value.trim();

    if (name === 'name') {
      if (!v) {
        showError(id, 'Nama tidak boleh kosong.');
        return false;
      }
      if (v.length < 2) {
        showError(id, 'Nama minimal 2 karakter.');
        return false;
      }
    }

    if (name === 'email') {
      if (!v) {
        showError(id, 'Email tidak boleh kosong.');
        return false;
      }
      if (!isValidEmail(v)) {
        showError(id, 'Format email tidak valid.');
        return false;
      }
    }

    if (name === 'message') {
      if (!v) {
        showError(id, 'Pesan tidak boleh kosong.');
        return false;
      }
      if (v.length < 10) {
        showError(id, 'Pesan minimal 10 karakter.');
        return false;
      }
    }

    clearError(id);
    return true;
  }

  // ── Submit ──────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredInputs = $$('.form-input[required]', form);
    let isValid = true;

    requiredInputs.forEach(input => {
      const ok = validateField(input);
      if (!ok) isValid = false;
    });

    if (!isValid) return;

    // Simulate send (replace with actual API call)
    const submitBtn  = $('#form-submit', form);
    const btnText    = $('.btn-text', submitBtn);

    submitBtn.disabled      = true;
    if (btnText) btnText.textContent = 'Mengirim...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Kirim Pesan';

      // Clear any lingering errors
      inputs.forEach(input => clearError(input.id));

      // Show success message
      if (success) {
        success.classList.add('show');
        window.lucide?.createIcons();
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1500);
  });
})();

/* ═══════════════════════════════════════════
   10. SMOOTH SCROLL for all anchor links
═══════════════════════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '72',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════
   11. PROJECT CARD — tilt micro-interaction
═══════════════════════════════════════════ */
(function initCardTilt() {
  // Only on pointer devices (no touch)
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = $$('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -4;
      const tiltY  = dx * 4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════
   12. SKILL BADGE — staggered entrance
═══════════════════════════════════════════ */
(function initSkillBadges() {
  const badges = $$('.skill-badge');
  const container = $('.skills-grid');
  if (!container) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    badges.forEach((badge, i) => {
      badge.style.opacity    = '0';
      badge.style.transform  = 'translateY(10px)';
      badge.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      setTimeout(() => {
        badge.style.opacity   = '1';
        badge.style.transform = 'none';
      }, i * 50);
    });
    observer.unobserve(container);
  }, { threshold: 0.3 });

  observer.observe(container);
})();

/* ═══════════════════════════════════════════
   13. BACK-TO-TOP visibility
═══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });

  // Initial state
  btn.style.opacity = '0';
  btn.style.transition = 'opacity 0.3s ease';
  btn.style.pointerEvents = 'none';
})();

/* ═══════════════════════════════════════════
   14. RE-INIT ICONS after DOM changes
═══════════════════════════════════════════ */
// Ensure icons are always rendered
window.addEventListener('load', () => {
  window.lucide?.createIcons();
});
