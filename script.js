// ==========================================================================
// PORTFOLIO SCRIPTS — NAFIL ARDUL RIDIN
// Features: Dark/Light Mode, Typewriter, Project Filtering, Clipboard Toast,
// Mobile Menu, Active Scrollspy, and Contact Form Feedback.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Dark / Light Mode Toggle ----------
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Check saved preference or fallback to dark
  const savedTheme = localStorage.getItem('nafil_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('nafil_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }

  // ---------- 2. Typewriter Effect ----------
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Full Stack & Web Engineering',
      'Algorithms & Compiler Design',
      'Disaster Relief & Security Systems',
      'Numerical Modeling & Data Analytics',
      'Digital Logic & Hardware Circuits',
      'Content Strategy & HR Leadership'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 75;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 35;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  // ---------- 3. Project Filter Tabs ----------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---------- 4. Toast Notification & Copy to Clipboard ----------
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Delegated click listener for copy buttons
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      e.preventDefault();
      const textToCopy = copyBtn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: ${textToCopy}`);
      }).catch(() => {
        showToast('Unable to copy to clipboard');
      });
    }
  });

  // ---------- 5. Mobile Navigation Menu ----------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when a nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- 6. Personal Details Focus Button ----------
  const viewBioDetailsBtn = document.getElementById('viewBioDetailsBtn');
  const personalDetailsCard = document.getElementById('personalDetailsCard');
  if (viewBioDetailsBtn && personalDetailsCard) {
    viewBioDetailsBtn.addEventListener('click', () => {
      personalDetailsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      personalDetailsCard.style.outline = '2px solid var(--peach)';
      personalDetailsCard.style.boxShadow = '0 0 25px var(--peach-glow)';
      setTimeout(() => {
        personalDetailsCard.style.outline = 'none';
        personalDetailsCard.style.boxShadow = 'var(--card-shadow)';
      }, 2000);
    });
  }

  // ---------- 7. Active Nav Link on Scroll (Intersection Observer) ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ---------- 8. Contact Form Handler ----------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      
      formStatus.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been received. I will respond to <em>${email}</em> promptly.`;
      formStatus.style.color = 'var(--peach)';
      showToast('Message sent successfully!');
      contactForm.reset();

      setTimeout(() => {
        formStatus.textContent = '';
      }, 6000);
    });
  }

});
