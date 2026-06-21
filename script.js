/* ============================================================
   PORTFOLIO — SCRIPT PRINCIPAL (script.js)
   Fonctionnalités :
   - Curseur personnalisé
   - Navbar scroll + liens actifs
   - Menu mobile
   - Basculement dark/light mode
   - Effet de typing (Hero)
   - Animations au scroll (IntersectionObserver)
   - Barres de compétences animées
   - Filtrage des projets
   - Formulaire de contact simulé
   ============================================================ */

/* ============================================================
   1. CURSEUR PERSONNALISÉ
   ============================================================ */
(function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (!cursor || !cursorFollower) return;

  // Position du curseur principal (instantanée)
  let mouseX = 0, mouseY = 0;
  // Position du cercle suiveur (avec inertie)
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Animation fluide du cercle suiveur avec requestAnimationFrame
  function animateFollower() {
    const speed = 0.12;
    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Agrandissement du cercle sur les éléments interactifs
  const interactives = 'a, button, .project-card, .skill-category, .filter-btn, input, textarea';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ============================================================
   2. BARRE DE NAVIGATION — SCROLL & LIEN ACTIF
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Ajout de la classe .scrolled après 50px de scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveLink();
  }, { passive: true });

  // Met en surbrillance le lien de la section visible
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
})();

/* ============================================================
   3. MENU MOBILE
   ============================================================ */
(function initMobileMenu() {
  const burger      = document.getElementById('burger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!burger || !mobileMenu) return;

  // Ouvrir le menu
  function openMenu() {
    mobileMenu.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden'; // Empêche le scroll du fond
  }

  // Fermer le menu
  function closeMenu() {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);

  // Fermer lors du clic sur un lien
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();

/* ============================================================
   4. DARK / LIGHT MODE
   ============================================================ */
(function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;

  if (!themeToggle) return;

  // Récupère la préférence sauvegardée ou la préférence système
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Applique le thème initial
  html.setAttribute('data-theme', initialTheme);
  updateIcon(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  // Met à jour l'icône selon le thème
  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
})();

/* ============================================================
   5. EFFET DE TYPING (HERO)
   ============================================================ */
(function initTyping() {
  const typedText = document.getElementById('typedText');
  if (!typedText) return;

  // Rôles à afficher en rotation
  const roles = [
    'Développeur Web Full-Stack',
    'Développeur Mobile',
    'Ingénieur Logiciel',
    'Architecte de Solutions',
    'Passionné du code open-source'
  ];

  let roleIndex    = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Effacement caractère par caractère
      typedText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Frappe caractère par caractère
      typedText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    // Délais de frappe
    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause avant d'effacer
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Passe au rôle suivant
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Lance l'animation après un délai initial
  setTimeout(type, 800);
})();

/* ============================================================
   6. ANIMATIONS AU SCROLL (INTERSECTION OBSERVER)
   ============================================================ */
(function initScrollReveal() {
  // Sélectionne tous les éléments à animer
  const elements = document.querySelectorAll('.reveal, .fade-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Désabonnement après l'animation pour les performances
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,     // 12% de l'élément visible
      rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant d'atteindre le bas
    }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   7. BARRES DE COMPÉTENCES ANIMÉES
   ============================================================ */
(function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');
  if (!skillFills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill      = entry.target;
          const targetWidth = fill.getAttribute('data-width') + '%';

          // Petit délai pour que l'animation soit visible
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 200);

          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach(fill => observer.observe(fill));
})();

/* ============================================================
   8. FILTRAGE DES PROJETS
   ============================================================ */
(function initProjectFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Met à jour le bouton actif
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          // Affiche avec une petite animation
          card.classList.remove('hidden');
          card.style.animation = 'none';
          // Force le reflow pour relancer l'animation
          void card.offsetWidth;
          card.style.animation = 'fadeInProject 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Injection de l'animation de réapparition des projets
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInProject {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   9. FORMULAIRE DE CONTACT — EMAILJS
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  const EMAILJS_PUBLIC_KEY  = 'VkO6wjBSmHn4_UcVb';
  const EMAILJS_SERVICE_ID  = 'service_i1dcu8g';
  const EMAILJS_TEMPLATE_ID = 'template_yowc8yq';

  emailjs.init(EMAILJS_PUBLIC_KEY);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name    = document.getElementById('name').value.trim();
    var email   = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm();
      return;
    }

    setLoadingState(true);

    var templateParams = {
      from_name:  name,
      from_email: email,
      subject:    subject,
      message:    message,
      reply_to:   email
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function(response) {
        console.log('✅ Succès :', response.status, response.text);
        setLoadingState(false);
        showSuccess();
        form.reset();
      })
      .catch(function(error) {
        console.error('❌ Erreur EmailJS :', JSON.stringify(error));
        setLoadingState(false);
        showError();
      });
  });

  function setLoadingState(loading) {
    if (!submitBtn) return;
    var btnText = submitBtn.querySelector('.btn-text');
    var btnIcon = submitBtn.querySelector('i');
    submitBtn.disabled = loading;
    if (btnText) btnText.textContent = loading ? 'Envoi en cours...' : 'Envoyer le message';
    if (btnIcon) btnIcon.className   = loading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane';
  }

  function showSuccess() {
    if (!formSuccess) return;
    formSuccess.classList.add('show');
    setTimeout(function() {
      formSuccess.classList.remove('show');
    }, 6000);
  }

  function showError() {
    var old = document.getElementById('errDiv');
    if (old) old.remove();

    var errDiv = document.createElement('div');
    errDiv.id = 'errDiv';
    errDiv.style.cssText = [
      'display:flex', 'align-items:center', 'gap:0.5rem',
      'padding:1rem', 'margin-top:0.75rem',
      'background:rgba(239,68,68,0.1)',
      'border:1px solid rgba(239,68,68,0.3)',
      'border-radius:0.5rem', 'color:#ef4444', 'font-size:0.875rem'
    ].join(';');
    errDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Échec de l\'envoi. Vérifie ta connexion ou réessaie.';
    form.appendChild(errDiv);
    setTimeout(function() { errDiv.remove(); }, 5000);
  }

  function shakeForm() {
    form.style.animation = 'none';
    void form.offsetWidth;
    form.style.animation = 'shake 0.4s ease';
  }

})();
/* ============================================================
   10. SCROLL FLUIDE POUR LES LIENS D'ANCRAGE
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);

      if (target) {
        const navbarHeight = 70;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   11. COMPTEUR ANIMÉ (STATS HERO)
   ============================================================ */
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const text   = el.textContent;
          // Extrait le nombre (ex: "3+" → 3, "20+" → 20)
          const target = parseInt(text.replace(/\D/g, ''), 10);
          const suffix = text.replace(/[0-9]/g, ''); // "+" ou " ans" etc.

          let current = 0;
          const increment = Math.ceil(target / 30); // ~30 étapes

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 40);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
})();

/* ============================================================
   12. EFFETS DE PARALLAXE LÉGERS (ORBES HERO)
   ============================================================ */
(function initParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (!orb1 || !orb2) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Déplacement léger et différent pour chaque orbe
    orb1.style.transform = `translate(${scrollY * 0.05}px, ${-scrollY * 0.08}px)`;
    orb2.style.transform = `translate(${-scrollY * 0.04}px, ${scrollY * 0.06}px)`;
  }, { passive: true });
})();

/* ============================================================
   INITIALISATION — Point d'entrée
   Lance toutes les fonctions au chargement du DOM
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Log de confirmation en console (à retirer en production)
  console.log('%c Portfolio chargé avec succès ✓', 'color: #f0a500; font-weight: bold; font-size: 14px;');
});
