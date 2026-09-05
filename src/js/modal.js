/**
 * Interactive Modal Controller & Deep Linking Engine
 * Handles modal open/close, focus trapping, scrollspy, count-ups,
 * and browser history synchronization for direct case study URLs.
 */

export function initCaseStudy(ids) {
  const modal = document.getElementById(ids.modal);
  if (!modal) return null;

  const panel = document.getElementById(ids.panel);
  const openBtn = document.getElementById(ids.openBtn);
  const closeBtn = document.getElementById(ids.closeBtn);
  const backBtn = document.getElementById(ids.backBtn);
  const progressFill = document.getElementById(ids.progressFill);
  const navLinks = Array.from(modal.querySelectorAll('.cs-nav-inner a'));
  const sections = Array.from(modal.querySelectorAll('.cs-sec'));
  let lastFocused = null;
  let countedUp = false;

  function openModal(updateHistory = true) {
    lastFocused = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (panel) panel.scrollTop = 0;
    if (closeBtn) closeBtn.focus();
    requestAnimationFrame(revealCheck);

    if (updateHistory && ids.slug) {
      const targetUrl = `/projects/${ids.slug}`;
      if (window.location.pathname !== targetUrl) {
        try {
          window.history.pushState({ modalOpen: ids.slug }, '', targetUrl);
        } catch (_) {
          window.location.hash = ids.slug;
        }
      }
    }
  }

  function closeModal(updateHistory = true) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }

    if (updateHistory) {
      try {
        if (window.location.pathname.startsWith('/projects/')) {
          window.history.pushState(null, '', '/#projects');
        } else if (window.location.hash.includes(ids.slug)) {
          window.history.pushState(null, '', window.location.pathname + '#projects');
        }
      } catch (_) {}
    }
  }

  if (openBtn) openBtn.addEventListener('click', () => openModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(true));
  if (backBtn) backBtn.addEventListener('click', () => closeModal(true));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal(true);
    }
  });

  // Smooth scroll for in-modal nav links
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSelector = a.getAttribute('href');
      if (targetSelector && targetSelector.startsWith('#')) {
        const target = modal.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  function revealCheck() {
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85) {
        sec.classList.add('in-view');
      }
    });
  }

  function runCountUps() {
    if (countedUp) return;
    countedUp = true;
    modal.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseInt(el.getAttribute('data-countup'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 900;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = val.toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (panel) {
    panel.addEventListener('scroll', () => {
      const scrollable = panel.scrollHeight - panel.clientHeight;
      const pct = scrollable > 0 ? (panel.scrollTop / scrollable) * 100 : 0;
      if (progressFill) progressFill.style.width = pct + '%';

      revealCheck();

      const glance = modal.querySelector('.cs-glance');
      if (glance) {
        const r = glance.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.8) {
          runCountUps();
        }
      }

      let currentId = sections[0] ? sections[0].id : null;
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        if (r.top <= 140) currentId = sec.id;
      });

      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
      });
    });
  }

  // Research framework accordion (single-open)
  modal.querySelectorAll('.cs-fw-item').forEach(item => {
    const btn = item.querySelector('.cs-fw-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        modal.querySelectorAll('.cs-fw-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  // Focus / challenge cards expand
  modal.querySelectorAll('.cs-focus-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('open'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('open');
      }
    });
  });

  // SDG / category card tap-to-reveal
  modal.querySelectorAll('.cs-sdg-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('open'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('open');
      }
    });
  });

  // Technology node tap-to-reveal
  modal.querySelectorAll('.i4-tech-node').forEach(node => {
    node.addEventListener('click', () => node.classList.toggle('open'));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.classList.toggle('open');
      }
    });
  });

  // Limitations accordion
  const limAccordion = modal.querySelector('.cs-accordion');
  const limHead = modal.querySelector('.cs-acc-head');
  if (limHead && limAccordion) {
    limHead.addEventListener('click', () => limAccordion.classList.toggle('open'));
  }

  return {
    open: openModal,
    close: closeModal,
    isOpen: () => modal.classList.contains('open'),
    slug: ids.slug
  };
}

/**
 * Checks current URL path or hash to automatically open the appropriate case study modal
 */
export function handleDirectRoute(controllers) {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  for (const ctrl of controllers) {
    if (!ctrl || !ctrl.slug) continue;
    const slug = ctrl.slug.toLowerCase();
    if (path.includes(`/projects/${slug}`) || hash === `#${slug}` || hash === `#project-${slug}`) {
      setTimeout(() => {
        ctrl.open(false);
      }, 100);
      return;
    }
  }
}
