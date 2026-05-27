/* =====================================================
   NexaServices — script.js
   Interactions : navbar, menu, scroll reveal,
   validation formulaire, back-to-top
   ===================================================== */

'use strict';

/* ── 1. NAVBAR : effet sticky au scroll ─────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  /* Sticky navbar */
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Bouton back-to-top */
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

/* ── 2. MENU HAMBURGER (menu latéral gauche) ────────── */

/* Créer l'overlay dynamiquement */
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

/* Ferme au clic sur l'overlay */
overlay.addEventListener('click', closeMenu);

/* Ferme au clic sur un lien */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ── 3. SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // hauteur navbar fixe
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 4. BACK TO TOP ─────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 5. SCROLL REVEAL ───────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      /* Décalage léger pour effet en cascade */
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

/* Ajouter un délai en cascade aux cartes enfants */
function addStaggeredDelays(selector, step = 120) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.delay = i * step;
  });
}

addStaggeredDelays('.service-card', 90);
addStaggeredDelays('.pack-card',    120);
addStaggeredDelays('.avis-card',    110);
addStaggeredDelays('.galerie-item', 80);

revealElements.forEach(el => revealObserver.observe(el));

/* ── 6. VALIDATION ET SOUMISSION DU FORMULAIRE ───────── */
const form         = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

/**
 * Affiche un message d'erreur sous un champ.
 * @param {string} fieldId  – id du champ
 * @param {string} errorId  – id du <span> d'erreur
 * @param {string} message  – texte à afficher (vide = effacement)
 */
function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!error) return;
  error.textContent = message;
  if (message) {
    field.style.borderColor = '#e53e3e';
  } else {
    field.style.borderColor = '';
  }
}

/** Valide l'email avec une regex basique */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Valide le téléphone (accepte +, espaces, tirets, chiffres) */
function isValidPhone(phone) {
  return /^[\d\s\+\-]{7,20}$/.test(phone.trim());
}

/** Valide tous les champs et retourne true si le formulaire est valide */
function validateForm() {
  let valid = true;

  const nom     = document.getElementById('nom').value.trim();
  const tel     = document.getElementById('tel').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  /* Nom */
  if (nom.length < 2) {
    setError('nom', 'nomError', 'Veuillez entrer votre nom complet.');
    valid = false;
  } else {
    setError('nom', 'nomError', '');
  }

  /* Téléphone */
  if (!isValidPhone(tel)) {
    setError('tel', 'telError', 'Numéro de téléphone invalide.');
    valid = false;
  } else {
    setError('tel', 'telError', '');
  }

  /* Email */
  if (!isValidEmail(email)) {
    setError('email', 'emailError', 'Adresse email invalide.');
    valid = false;
  } else {
    setError('email', 'emailError', '');
  }

  /* Message */
  if (message.length < 10) {
    setError('message', 'messageError', 'Le message doit contenir au moins 10 caractères.');
    valid = false;
  } else {
    setError('message', 'messageError', '');
  }

  return valid;
}

/* Validation en temps réel à la saisie */
['nom', 'tel', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    /* Re-valider seulement le champ modifié */
    if (id === 'nom') {
      const v = el.value.trim();
      setError('nom', 'nomError', v.length < 2 ? 'Veuillez entrer votre nom complet.' : '');
    }
    if (id === 'tel') {
      setError('tel', 'telError', isValidPhone(el.value) ? '' : 'Numéro de téléphone invalide.');
    }
    if (id === 'email') {
      setError('email', 'emailError', isValidEmail(el.value) ? '' : 'Adresse email invalide.');
    }
    if (id === 'message') {
      setError('message', 'messageError', el.value.trim().length < 10 ? 'Message trop court (min. 10 caractères).' : '');
    }
  });
});

/* Soumission */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  /* Simuler l'envoi (pas de backend) */
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';
  submitBtn.disabled = true;

  setTimeout(() => {
    /* Succès simulé */
    form.reset();
    /* Réinitialiser les bordures */
    ['nom','tel','email','message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.borderColor = '';
    });

    formSuccess.classList.add('show');
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer la demande';
    submitBtn.disabled = false;

    /* Cacher le message de succès après 6s */
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 6000);
  }, 1500);
});


/* ── TOGGLE SERVICES ────────────────────────────────── */
const toggleServicesBtn = document.getElementById('toggleServices');
const servicesGrid      = document.querySelector('.services-grid');

if (toggleServicesBtn && servicesGrid) {
  toggleServicesBtn.addEventListener('click', () => {
    const isOpen = servicesGrid.classList.toggle('show-all');
    if (isOpen) {
      toggleServicesBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>&nbsp; Voir moins';
      servicesGrid.querySelectorAll('.service-hidden').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 90);
      });
    } else {
      toggleServicesBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>&nbsp; Voir plus de services';
    }
  });
}

/* ── 7. COMPTEUR ANIMÉ POUR LES STATS HERO ───────────── */
function animateCounter(el, target, duration = 1500, suffix = '') {
  const start     = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease-out */
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(start + (target - start) * eased);
    el.textContent = (suffix === '%' || suffix === '') ? current + suffix : '+' + current;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* Observer les stats hero */
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const statNumbers = statsSection.querySelectorAll('.stat-number');
      /* 500+, 8, 98% */
      const targets  = [500, 8, 98];
      const suffixes = ['+', '', '%'];

      statNumbers.forEach((el, i) => {
        setTimeout(() => {
          animateCounter(el, targets[i], 1400, suffixes[i]);
        }, i * 200);
      });

      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);
}

/* ── 8. INDICATEUR DE SECTION ACTIVE DANS LA NAVBAR ─── */
const sections   = document.querySelectorAll('section[id]');
const navAnchor  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchor.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

/* Style du lien actif (injecté dynamiquement) */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--white) !important;
    background: rgba(255,255,255,.1) !important;
  }
`;
document.head.appendChild(style);


/* ── SLIDER AVIS MOBILE ─────────────────────────────── */
const avisCards = document.querySelectorAll('.avis-card');
const avisPrev  = document.querySelector('.avis-prev');
const avisNext  = document.querySelector('.avis-next');
const avisDots  = document.querySelectorAll('.avis-dot');
let   currentAvis = 0;

function showAvis(index) {
  if (!avisCards.length) return;
  avisCards.forEach((card, i) => card.classList.toggle('active', i === index));
  avisDots.forEach((dot, i)  => dot.classList.toggle('active', i === index));
}

if (avisCards.length && avisPrev && avisNext) {
  /* Premier avis actif au chargement (mobile uniquement via CSS) */
  showAvis(currentAvis);

  avisNext.addEventListener('click', () => {
    currentAvis = (currentAvis + 1) % avisCards.length;
    showAvis(currentAvis);
  });
  avisPrev.addEventListener('click', () => {
    currentAvis = (currentAvis - 1 + avisCards.length) % avisCards.length;
    showAvis(currentAvis);
  });
  avisDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { currentAvis = i; showAvis(i); });
  });
}

/* ── 9. ANIMATION PULSE SUR LE BOUTON WHATSAPP ────────── */
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) {
  /* Pulse toutes les 4 secondes */
  setInterval(() => {
    waFloat.style.transform = 'scale(1.2)';
    setTimeout(() => { waFloat.style.transform = ''; }, 300);
  }, 4000);
}

/* === SERVICES : Voir plus / moins === */
function toggleServices() {
  const extra = document.getElementById('services-extra');
  const btn = document.getElementById('btnVoirServices');
  const icon = document.getElementById('iconVoirServices');

  if (!extra || !btn) return;

  const visible = extra.style.display !== 'none';
  extra.style.display = visible ? 'none' : 'contents';
  btn.innerHTML = visible
    ? '<i class="fa-solid fa-chevron-down" id="iconVoirServices"></i> Voir plus de services'
    : '<i class="fa-solid fa-chevron-up" id="iconVoirServices"></i> Voir moins';
}

/* === AVIS : Slider mobile === */
let avisIndex = 0;

function initAvis() {
  const cards = document.querySelectorAll('.avis-card');

  if (!cards.length) return;

  if (window.innerWidth > 768) {
    cards.forEach(c => c.classList.remove('active'));
    return;
  }

  cards.forEach((c, i) => c.classList.toggle('active', i === avisIndex));
}

function avisSlide(dir) {
  const cards = document.querySelectorAll('.avis-card');

  if (!cards.length) return;

  avisIndex = (avisIndex + dir + cards.length) % cards.length;
  initAvis();
}

window.addEventListener('load', initAvis);
window.addEventListener('resize', initAvis);

/* Rendre les fonctions disponibles pour les onclick du HTML */
window.toggleServices = toggleServices;
window.avisSlide = avisSlide;

