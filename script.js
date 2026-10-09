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

  // ---------- 8. Contact Form Handler (Real Email Delivery via FormSubmit) ----------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Set Loading UI State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Sending...</span>
          <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"/>
          </svg>
        `;
      }
      formStatus.innerHTML = '<span style="color:var(--text-muted);">⏳ Sending your message directly to Nafil\'s inbox...</span>';

      const formData = new FormData(contactForm);
      formData.set('_subject', subject ? `Portfolio Message: ${subject}` : `New message from ${name} (Portfolio)`);
      formData.set('_replyto', email);

      try {
        const response = await fetch('https://formsubmit.co/ajax/nafilridinssbu@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          formStatus.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your message was delivered straight to my email inbox. I will reply to <em>${email}</em> soon!`;
          formStatus.style.color = 'var(--peach)';
          showToast('Message sent to inbox successfully!');
          contactForm.reset();
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          formStatus.innerHTML = `📩 <strong>One-time activation required:</strong> FormSubmit just sent an activation link to <em>nafilridinssbu@gmail.com</em>. Please check your Gmail (inbox or Spam folder) and click <strong>"Activate Form"</strong>.`;
          formStatus.style.color = 'var(--peach)';
          showToast('Check your Gmail to activate the form!');
        } else if (data.message && data.message.includes('web server')) {
          formStatus.innerHTML = `⚠️ FormSubmit requires the site to be browsed online (e.g. on GitHub Pages) rather than opened directly as a local HTML file.`;
          formStatus.style.color = '#ef4444';
          showToast('Please test via your GitHub Pages link');
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      } catch (err) {
        console.error('Contact form delivery error:', err);
        formStatus.innerHTML = `⚠️ Direct delivery failed. Please send an email directly to <a href="mailto:nafilridinssbu@gmail.com" style="color:var(--peach);text-decoration:underline;">nafilridinssbu@gmail.com</a>`;
        formStatus.style.color = '#ef4444';
        showToast('Could not send message. Please email directly.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }

        setTimeout(() => {
          if (formStatus.textContent.includes('✓')) {
            formStatus.textContent = '';
          }
        }, 8000);
      }
    });
  }

  // ---------- 9. Profile Picture Interactive Side Dim Light & 3D Tilt ----------
  const avatarCardWrapper = document.getElementById('avatarCardWrapper');
  const avatarFrame = document.getElementById('avatarFrame');

  if (avatarCardWrapper && avatarFrame) {
    let isHovering = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let animFrame = null;

    function smoothTilt() {
      if (!isHovering) {
        currentTiltX += (0 - currentTiltX) * 0.12;
        currentTiltY += (0 - currentTiltY) * 0.12;
        if (Math.abs(currentTiltX) < 0.05 && Math.abs(currentTiltY) < 0.05) {
          currentTiltX = 0;
          currentTiltY = 0;
          avatarFrame.style.transform = '';
          cancelAnimationFrame(animFrame);
          animFrame = null;
          return;
        }
      } else {
        currentTiltX += (targetTiltX - currentTiltX) * 0.15;
        currentTiltY += (targetTiltY - currentTiltY) * 0.15;
      }

      avatarFrame.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      animFrame = requestAnimationFrame(smoothTilt);
    }

    function updateAvatarLight(e) {
      const rect = avatarCardWrapper.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); // 0 to 1
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)); // 0 to 1

      // Dynamically track cursor position: light follows cursor directly on whichever side it is
      const outerX = (x * 100).toFixed(1);
      const outerY = (y * 100).toFixed(1);
      const outerShiftX = ((x - 0.5) * 36).toFixed(1);
      const outerShiftY = ((y - 0.5) * 24).toFixed(1);

      avatarCardWrapper.style.setProperty('--outer-light-x', `${outerX}%`);
      avatarCardWrapper.style.setProperty('--outer-light-y', `${outerY}%`);
      avatarCardWrapper.style.setProperty('--outer-shift-x', `${outerShiftX}px`);
      avatarCardWrapper.style.setProperty('--outer-shift-y', `${outerShiftY}px`);

      // Gentle 3D tilt coordinates
      targetTiltX = (y - 0.5) * -12;
      targetTiltY = (x - 0.5) * 12;
    }

    avatarCardWrapper.addEventListener('mouseenter', (e) => {
      isHovering = true;
      updateAvatarLight(e);
      if (!animFrame) {
        animFrame = requestAnimationFrame(smoothTilt);
      }
    });

    avatarCardWrapper.addEventListener('mousemove', (e) => {
      updateAvatarLight(e);
      if (!animFrame) {
        animFrame = requestAnimationFrame(smoothTilt);
      }
    });

    avatarCardWrapper.addEventListener('mouseleave', () => {
      isHovering = false;
      targetTiltX = 0;
      targetTiltY = 0;
    });
  }

  // ---------- 10. Scroll Blur-to-Appear Reveal Observer ----------
  const revealTargets = document.querySelectorAll(
    '.blur-reveal, .section-header, .about-layout, .skill-category-card, .project-card, .timeline-card, .edu-card, .cert-card, .dual-column-card, .profile-card, .contact-card, .social-panel, .contact-form'
  );

  revealTargets.forEach(el => {
    el.classList.add('blur-reveal');
  });

  // Apply sequential stagger to grid children
  const gridGroups = document.querySelectorAll('.skills-wrapper, .projects-grid, .timeline, .edu-grid, .certifications-grid');
  gridGroups.forEach(grid => {
    Array.from(grid.children).forEach((child, idx) => {
      child.classList.add(`stagger-${(idx % 5) + 1}`);
    });
  });

  function checkAndRevealVisible() {
    const windowH = window.innerHeight || document.documentElement.clientHeight;
    revealTargets.forEach(el => {
      if (!el.classList.contains('revealed')) {
        const rect = el.getBoundingClientRect();
        // If element is in view or within 80px of entering viewport
        if (rect.top <= windowH * 0.92) {
          el.classList.add('revealed');
        }
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const blurObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '160px 0px 160px 0px',
      threshold: 0
    });

    revealTargets.forEach(el => {
      blurObserver.observe(el);
    });
  } else {
    // Fallback only for legacy browsers without IntersectionObserver
    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        requestAnimationFrame(() => {
          checkAndRevealVisible();
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    }, { passive: true });
  }

  // Initial check so above-the-fold content appears immediately
  checkAndRevealVisible();

  // ---------- 11. Skills Category Filters & Live Search ----------
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');
  const skillSearchInput = document.getElementById('skillSearchInput');

  if (skillFilterBtns.length > 0 && skillCategoryCards.length > 0) {
    skillFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        skillFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterVal = btn.getAttribute('data-skill-filter');

        skillCategoryCards.forEach(card => {
          const category = card.getAttribute('data-skill-category');
          if (filterVal === 'all' || category === filterVal) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
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
  }

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const allPills = document.querySelectorAll('.skill-pill');

      if (!query) {
        allPills.forEach(p => p.classList.remove('highlight'));
        skillCategoryCards.forEach(c => c.classList.remove('hidden'));
        return;
      }

      skillCategoryCards.forEach(card => {
        const pillsInCard = card.querySelectorAll('.skill-pill');
        let cardHasMatch = false;

        pillsInCard.forEach(pill => {
          const text = pill.textContent.toLowerCase();
          if (text.includes(query)) {
            pill.classList.add('highlight');
            cardHasMatch = true;
          } else {
            pill.classList.remove('highlight');
          }
        });

        if (cardHasMatch) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // ---------- 12. Dynamic Co-Curricular & Awards Tab Filtering ----------
  const actFilterBtns = document.querySelectorAll('.act-filter-btn');
  const actItems = document.querySelectorAll('.activity-item');
  const awardBoxes = document.querySelectorAll('.award-box');
  const actColumnCard = document.getElementById('activitiesColumnCard');
  const awardColumnCard = document.getElementById('awardsColumnCard');
  const actGrid = document.getElementById('activitiesAwardsGrid');

  if (actFilterBtns.length > 0) {
    actFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        actFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-act-filter');

        let visibleActs = 0;
        let visibleAwards = 0;

        // Filter activity items
        actItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 30);
            visibleActs++;
          } else {
            item.classList.add('hidden');
          }
        });

        // Filter award boxes
        awardBoxes.forEach(box => {
          const category = box.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            box.classList.remove('hidden');
            box.style.opacity = '0';
            box.style.transform = 'translateY(12px)';
            setTimeout(() => {
              box.style.opacity = '1';
              box.style.transform = 'translateY(0)';
            }, 30);
            visibleAwards++;
          } else {
            box.classList.add('hidden');
          }
        });

        // Smart column card layout handling
        if (actColumnCard && awardColumnCard && actGrid) {
          if (visibleActs === 0 && visibleAwards > 0) {
            actColumnCard.classList.add('hidden');
            awardColumnCard.classList.remove('hidden');
            actGrid.classList.add('collapsed-activities');
            actGrid.classList.remove('collapsed-awards');
          } else if (visibleAwards === 0 && visibleActs > 0) {
            awardColumnCard.classList.add('hidden');
            actColumnCard.classList.remove('hidden');
            actGrid.classList.add('collapsed-awards');
            actGrid.classList.remove('collapsed-activities');
          } else {
            actColumnCard.classList.remove('hidden');
            awardColumnCard.classList.remove('hidden');
            actGrid.classList.remove('collapsed-awards');
            actGrid.classList.remove('collapsed-activities');
          }
        }
      });
    });
  }

});
