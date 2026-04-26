/**
* Template Name: Personal - optimized
* Based on: BootstrapMade Personal v4.7.0
* Goal: Better performance, maintainability, resilience, and UX
*/
(() => {
  'use strict';

  const doc = document;
  const win = window;
  const prefersReducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = (selector, all = false, scope = doc) => {
    if (!selector) return all ? [] : null;
    return all ? Array.from(scope.querySelectorAll(selector)) : scope.querySelector(selector);
  };

  const on = (type, selector, handler, options = {}) => {
    const { all = false, target = doc, listenerOptions = false } = options;
    const elements = all ? select(selector, true, target) : [select(selector, false, target)];
    elements.filter(Boolean).forEach((element) => {
      element.addEventListener(type, handler, listenerOptions);
    });
  };

  const header = select('#header');
  const navbar = select('#navbar');
  const navLinks = select('#navbar .nav-link', true);
  const sections = select('section', true);
  const mobileNavToggle = select('.mobile-nav-toggle');

  const toggleMobileNav = (forceClose = false) => {
    if (!navbar || !mobileNavToggle) return;

    const shouldOpen = forceClose ? false : !navbar.classList.contains('navbar-mobile');
    navbar.classList.toggle('navbar-mobile', shouldOpen);
    mobileNavToggle.classList.toggle('bi-list', !shouldOpen);
    mobileNavToggle.classList.toggle('bi-x', shouldOpen);
    mobileNavToggle.setAttribute('aria-expanded', String(shouldOpen));
  };

  const setActiveNav = (hash) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === hash;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const showSection = (hash, updateHash = true) => {
    if (!hash || !header) return;

    if (hash === '#header') {
      header.classList.remove('header-top');
      sections.forEach((section) => section.classList.remove('section-show'));
      setActiveNav(hash);
      if (updateHash && win.location.hash !== hash) {
        history.replaceState(null, '', hash);
      }
      win.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }

    const targetSection = select(hash);
    if (!targetSection) return;

    setActiveNav(hash);
    header.classList.add('header-top');
    sections.forEach((section) => {
      section.classList.toggle('section-show', section === targetSection);
    });

    if (updateHash && win.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }

    win.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  if (mobileNavToggle) {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    on('click', '.mobile-nav-toggle', () => toggleMobileNav());
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const { hash } = link;
      const targetSection = hash ? select(hash) : null;
      if (!targetSection && hash !== '#header') return;

      event.preventDefault();
      if (navbar?.classList.contains('navbar-mobile')) {
        toggleMobileNav(true);
      }
      showSection(hash || '#header');
    });
  });

  win.addEventListener('load', () => {
    const initialHash = win.location.hash && select(win.location.hash) ? win.location.hash : '#header';
    showSection(initialHash, false);
  }, { once: true });

  win.addEventListener('hashchange', () => {
    const nextHash = win.location.hash && select(win.location.hash) ? win.location.hash : '#header';
    showSection(nextHash, false);
  });

  const skillsContent = select('.skills-content');
  if (skillsContent) {
    const progressBars = select('.progress .progress-bar', true);
    const animateSkills = () => {
      progressBars.forEach((bar) => {
        const value = Number(bar.getAttribute('aria-valuenow')) || 0;
        bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
      });
    };

    if ('IntersectionObserver' in win) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            obs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(skillsContent);
    } else if (typeof Waypoint !== 'undefined') {
      new Waypoint({
        element: skillsContent,
        offset: '80%',
        handler() {
          animateSkills();
          this.destroy();
        }
      });
    } else {
      animateSkills();
    }
  }

  if (typeof Swiper !== 'undefined') {
    const testimonialsSlider = select('.testimonials-slider');
    if (testimonialsSlider) {
      new Swiper(testimonialsSlider, {
        speed: 600,
        loop: true,
        autoplay: prefersReducedMotion ? false : {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: '.testimonials .swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          1200: {
            slidesPerView: 3,
            spaceBetween: 20
          }
        }
      });
    }

    const portfolioDetailsSlider = select('.portfolio-details-slider');
    if (portfolioDetailsSlider) {
      new Swiper(portfolioDetailsSlider, {
        speed: 400,
        loop: true,
        autoplay: prefersReducedMotion ? false : {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.portfolio-details .swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }
  }

  win.addEventListener('load', () => {
    const portfolioContainer = select('.portfolio-container');
    const portfolioFilters = select('#portfolio-flters li', true);

    if (!portfolioContainer || !portfolioFilters.length) return;

    let portfolioIsotope = null;
    if (typeof Isotope !== 'undefined') {
      portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
    }

    portfolioFilters.forEach((filter) => {
      filter.addEventListener('click', (event) => {
        event.preventDefault();
        portfolioFilters.forEach((item) => item.classList.remove('filter-active'));
        filter.classList.add('filter-active');

        if (portfolioIsotope) {
          portfolioIsotope.arrange({
            filter: filter.getAttribute('data-filter') || '*'
          });
        }
      });
    });
  }, { once: true });

  if (typeof GLightbox !== 'undefined') {
    if (select('.portfolio-lightbox')) {
      GLightbox({ selector: '.portfolio-lightbox' });
    }

    if (select('.portfolio-details-lightbox')) {
      GLightbox({
        selector: '.portfolio-details-lightbox',
        width: '90%',
        height: '90vh'
      });
    }
  }
})();
