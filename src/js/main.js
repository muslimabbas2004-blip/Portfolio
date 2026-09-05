import { projectsData } from '../data/projects.js';
import { renderCaseStudies } from './render-case-study.js';
import { initCaseStudy, handleDirectRoute } from './modal.js';
import { initContactForm } from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile navigation menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Dynamically render case study content from structured data
  renderCaseStudies(projectsData);

  // 3. Initialize case study modals
  const ctrlPowerCement = initCaseStudy({
    modal: 'caseStudyModal',
    panel: 'csPanel',
    openBtn: 'openCaseStudy',
    closeBtn: 'csClose',
    backBtn: 'csBack',
    progressFill: 'csProgressFill',
    slug: 'power-cement'
  });

  const ctrlIndustry4 = initCaseStudy({
    modal: 'caseStudyModalI4',
    panel: 'csPanelI4',
    openBtn: 'openCaseStudyI4',
    closeBtn: 'csCloseI4',
    backBtn: 'csBackI4',
    progressFill: 'csProgressFillI4',
    slug: 'industry-4'
  });

  const controllers = [ctrlPowerCement, ctrlIndustry4].filter(Boolean);

  // 4. Handle direct URLs (/projects/power-cement, /projects/industry-4, etc.)
  handleDirectRoute(controllers);

  // 5. Browser history popstate (handles browser Back/Forward navigation)
  window.addEventListener('popstate', () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    let matched = false;

    controllers.forEach(ctrl => {
      if (!ctrl || !ctrl.slug) return;
      const slug = ctrl.slug.toLowerCase();
      if (path.includes(`/projects/${slug}`) || hash === `#${slug}`) {
        ctrl.open(false);
        matched = true;
      } else if (ctrl.isOpen && ctrl.isOpen()) {
        ctrl.close(false);
      }
    });

    if (!matched) {
      controllers.forEach(ctrl => {
        if (ctrl && ctrl.isOpen && ctrl.isOpen()) {
          ctrl.close(false);
        }
      });
    }
  });

  // 6. Initialize Contact Form
  initContactForm();
});
