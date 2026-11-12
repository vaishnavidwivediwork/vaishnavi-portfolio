/**
 * VAISHNAVI DWIVEDI — PORTFOLIO SCRIPT ARCHITECTURE
 * Pure Vanilla JavaScript (Zero Dependencies, Zero Frameworks)
 * Strict Monochrome Editorial System — Final Production Release
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. DYNAMIC MOBILE HEADER HEIGHT & STICKY SCROLL ELEVATION
  // ==========================================================================
  const navbar = document.getElementById('navbar');

  function updateHeaderHeight() {
    if (!navbar) return;
    const headerHeight = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  updateHeaderHeight();

  if (window.ResizeObserver && navbar) {
    const headerObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });
    headerObserver.observe(navbar);
  } else {
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    window.addEventListener('orientationchange', updateHeaderHeight, { passive: true });
  }

  let isHeaderScrolled = null;

  function handleHeaderScroll() {
    if (!navbar) return;
    const shouldBeScrolled = window.scrollY > 20;
    if (shouldBeScrolled !== isHeaderScrolled) {
      isHeaderScrolled = shouldBeScrolled;
      navbar.classList.toggle('is-scrolled', isHeaderScrolled);
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ==========================================================================
  // 2. DYNAMIC FOOTER COPYRIGHT YEAR
  // ==========================================================================
  const copyrightYearEl = document.getElementById('copyrightYear');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = String(new Date().getFullYear());
  }

  // ==========================================================================
  // 3. SHARED SCROLL LOCK & UNIFIED TOPMOST FOCUS TRAP
  // ==========================================================================
  const systemModal = document.getElementById('systemModal');
  const lightboxModal = document.getElementById('lightboxModal');

  function updatePageScrollLock() {
    const isSystemModalOpen = Boolean(systemModal && systemModal.classList.contains('is-open'));
    const isLightboxOpen = Boolean(lightboxModal && lightboxModal.classList.contains('is-open'));

    if (isSystemModalOpen || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function isElementSafelyFocusable(el) {
    if (!el || !el.isConnected || typeof el.focus !== 'function') return false;
    if ('disabled' in el && el.disabled) return false;
    if (el.closest('[aria-hidden="true"], .is-hidden')) return false;
    if (el.getClientRects().length === 0) return false;
    return true;
  }

  function trapFocusWithin(container, event) {
    if (event.key !== 'Tab') return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors))
      .filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const isSystemModalOpen = Boolean(systemModal && systemModal.classList.contains('is-open'));
    const isLightboxOpen = Boolean(lightboxModal && lightboxModal.classList.contains('is-open'));

    if (isSystemModalOpen) {
      trapFocusWithin(systemModal, e);
    } else if (isLightboxOpen) {
      trapFocusWithin(lightboxModal, e);
    }
  });

  // ==========================================================================
  // 4. SYSTEM NOTIFICATION MODAL SYSTEM
  // ==========================================================================
  const systemModalBackdrop = document.getElementById('systemModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalHeading = document.getElementById('modalHeading');
  const modalBody = document.getElementById('modalBody');

  let lastActiveElementBeforeModal = null;
  let pendingModalAction = null;

  function showSystemNotice(title, message, onConfirmAction = null, confirmButtonText = 'Acknowledge') {
    if (!systemModal || !modalHeading || !modalBody) return;

    lastActiveElementBeforeModal = document.activeElement;
    pendingModalAction = onConfirmAction;

    modalHeading.textContent = title;
    modalBody.textContent = message;

    if (modalDismissBtn) {
      modalDismissBtn.textContent = confirmButtonText;
    }

    systemModal.classList.add('is-open');
    systemModal.setAttribute('aria-hidden', 'false');
    updatePageScrollLock();

    if (modalDismissBtn) {
      modalDismissBtn.focus();
    }
  }

  function hideSystemNotice(shouldTriggerConfirm = false) {
    if (!systemModal) return;

    const actionToExecute = shouldTriggerConfirm ? pendingModalAction : null;
    const elementToRestore = lastActiveElementBeforeModal;

    pendingModalAction = null;
    lastActiveElementBeforeModal = null;

    systemModal.classList.remove('is-open');
    systemModal.setAttribute('aria-hidden', 'true');
    updatePageScrollLock();

    if (modalDismissBtn) {
      modalDismissBtn.textContent = 'Acknowledge';
    }

    try {
      if (typeof actionToExecute === 'function') {
        actionToExecute();
      }
    } finally {
      if (isElementSafelyFocusable(elementToRestore)) {
        elementToRestore.focus();
      }
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => hideSystemNotice(false));
  }
  if (systemModalBackdrop) {
    systemModalBackdrop.addEventListener('click', () => hideSystemNotice(false));
  }
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', () => hideSystemNotice(true));
  }

  // ==========================================================================
  // 5. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function openMobileNav() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-active');
  }

  function closeMobileNav(restoreFocus = false) {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-active');
    if (restoreFocus && isElementSafelyFocusable(mobileToggle)) {
      mobileToggle.focus();
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav(false);
      } else {
        openMobileNav();
      }
    });

    const allNavLinks = navMenu.querySelectorAll('a');
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav(false);
      });
    });
  }

  // ==========================================================================
  // 6. PORTFOLIO CATEGORY FILTERING (STATE-PRESERVING & ACCESSIBLE)
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  const prefersReducedMotion = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const originalControlStates = new WeakMap();

  function captureControlInitialState(el) {
    if (!originalControlStates.has(el)) {
      originalControlStates.set(el, {
        hasTabindex: el.hasAttribute('tabindex'),
        tabindexValue: el.getAttribute('tabindex'),
        supportsDisabled: 'disabled' in el,
        wasDisabled: 'disabled' in el ? Boolean(el.disabled) : false
      });
    }
  }

  function disableProjectInteractiveControls(card) {
    const controls = card.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
    controls.forEach((el) => {
      captureControlInitialState(el);
      el.setAttribute('tabindex', '-1');
      if ('disabled' in el) {
        el.disabled = true;
      }
    });
  }

  function restoreProjectInteractiveControls(card) {
    const controls = card.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
    controls.forEach((el) => {
      const saved = originalControlStates.get(el);
      if (!saved) return;

      if (saved.hasTabindex && saved.tabindexValue !== null) {
        el.setAttribute('tabindex', saved.tabindexValue);
      } else {
        el.removeAttribute('tabindex');
      }

      if (saved.supportsDisabled) {
        el.disabled = saved.wasDisabled;
      }
    });
  }

  // Snapshot initial states on load so any pre-hidden cards also preserve state
  projectItems.forEach((item) => {
    const controls = item.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
    controls.forEach(captureControlInitialState);
    if (item.classList.contains('is-hidden')) {
      disableProjectInteractiveControls(item);
    }
  });

  filterButtons.forEach((btn) => {
    const isTabRole = btn.getAttribute('role') === 'tab';
    const isInitiallyActive = btn.classList.contains('active');
    if (isTabRole) {
      btn.setAttribute('aria-selected', isInitiallyActive ? 'true' : 'false');
    } else {
      btn.setAttribute('aria-pressed', isInitiallyActive ? 'true' : 'false');
    }

    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');
      const currentlyFocused = document.activeElement;
      let focusedCardHidden = false;

      filterButtons.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle('active', isCurrent);
        if (b.getAttribute('role') === 'tab') {
          b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        } else {
          b.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
        }
      });

      let visibleIndex = 0;
      projectItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const isMatch = targetFilter === 'all' || itemCategory === targetFilter;

        if (isMatch) {
          item.classList.remove('is-hidden', 'filter-animate');
          item.removeAttribute('aria-hidden');
          restoreProjectInteractiveControls(item);

          if (!prefersReducedMotion) {
            void item.offsetWidth;
            item.style.animationDelay = `${visibleIndex * 0.05}s`;
            item.classList.add('filter-animate');
          } else {
            item.style.animationDelay = '';
          }
          visibleIndex++;
        } else {
          if (currentlyFocused && item.contains(currentlyFocused)) {
            focusedCardHidden = true;
          }

          item.classList.add('is-hidden');
          item.classList.remove('filter-animate');
          item.setAttribute('aria-hidden', 'true');
          item.style.animationDelay = '';
          disableProjectInteractiveControls(item);
        }
      });

      if (focusedCardHidden && isElementSafelyFocusable(btn)) {
        btn.focus();
      }
    });
  });

  // ==========================================================================
  // 7. PORTFOLIO EXPANDABLE LIGHTBOX
  // ==========================================================================
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCustomContent = document.getElementById('lightboxCustomContent');
  const expandButtons = document.querySelectorAll('.expand-lightbox-btn');

  let lastActiveElementBeforeLightbox = null;
  let activeLightboxRequestId = 0;

  function renderLightboxImageFallback(src) {
    if (lightboxImage) {
      lightboxImage.style.display = 'none';
    }
    if (!lightboxCustomContent) return;

    lightboxCustomContent.style.display = 'block';
    lightboxCustomContent.replaceChildren();

    const fallbackBox = document.createElement('div');
    fallbackBox.style.border = '1px solid #000000';
    fallbackBox.style.padding = '3rem 2rem';
    fallbackBox.style.textAlign = 'center';
    fallbackBox.style.maxWidth = '500px';
    fallbackBox.style.margin = '0 auto';
    fallbackBox.style.backgroundColor = '#FFFFFF';

    const placeholderTag = document.createElement('span');
    placeholderTag.style.fontFamily = 'var(--font-mono)';
    placeholderTag.style.fontSize = '1.5rem';
    placeholderTag.style.fontWeight = '800';
    placeholderTag.style.color = '#000000';
    placeholderTag.style.border = '1px solid #000000';
    placeholderTag.style.padding = '0.35rem 0.85rem';
    placeholderTag.style.display = 'inline-block';
    placeholderTag.style.marginBottom = '1rem';
    placeholderTag.textContent = '[PLACEHOLDER]';

    const pathTag = document.createElement('span');
    pathTag.style.fontFamily = 'var(--font-mono)';
    pathTag.style.fontSize = '0.8rem';
    pathTag.style.color = '#000000';
    pathTag.style.display = 'block';
    pathTag.style.textTransform = 'uppercase';
    pathTag.textContent = `File path: ${src}`;

    const noticeText = document.createElement('p');
    noticeText.style.fontSize = '0.9rem';
    noticeText.style.marginTop = '1rem';
    noticeText.style.lineHeight = '1.5';
    noticeText.style.color = '#000000';
    noticeText.textContent = 'This preview image has not been uploaded to the repository yet. Upload the project image to this relative path to enable the photograph.';

    fallbackBox.appendChild(placeholderTag);
    fallbackBox.appendChild(pathTag);
    fallbackBox.appendChild(noticeText);
    lightboxCustomContent.appendChild(fallbackBox);
  }

  function openLightbox(triggerBtn) {
    if (!lightboxModal) return;

    const parentCard = triggerBtn.closest('.project-item');
    if (parentCard && parentCard.classList.contains('is-hidden')) {
      return;
    }

    activeLightboxRequestId += 1;
    const currentRequestId = activeLightboxRequestId;
    lastActiveElementBeforeLightbox = triggerBtn;

    const title = triggerBtn.getAttribute('data-title') || 'Project Preview';
    const category = triggerBtn.getAttribute('data-category') || 'Portfolio';
    const desc = triggerBtn.getAttribute('data-desc') || '';
    const src = triggerBtn.getAttribute('data-src');
    const isTerminal = triggerBtn.getAttribute('data-terminal') === 'true';
    const isAbstract = triggerBtn.getAttribute('data-abstract') === 'true';

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxDesc) lightboxDesc.textContent = desc;

    if (lightboxImage) {
      lightboxImage.onerror = null;
      lightboxImage.onload = null;
      lightboxImage.style.display = 'none';
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }
    if (lightboxCustomContent) {
      lightboxCustomContent.style.display = 'none';
      lightboxCustomContent.replaceChildren();
    }

    if (isTerminal) {
      if (lightboxCustomContent) {
        lightboxCustomContent.style.display = 'block';

        const terminalWrapper = document.createElement('div');
        terminalWrapper.className = 'terminal-mockup';
        terminalWrapper.style.maxWidth = '650px';
        terminalWrapper.style.margin = '0 auto';
        terminalWrapper.style.border = '1px solid #000000';
        terminalWrapper.style.padding = '1rem';
        terminalWrapper.style.backgroundColor = '#FFFFFF';

        const terminalHeader = document.createElement('div');
        terminalHeader.style.fontFamily = 'var(--font-mono)';
        terminalHeader.style.fontSize = '0.8rem';
        terminalHeader.style.fontWeight = '700';
        terminalHeader.style.borderBottom = '1px solid #000000';
        terminalHeader.style.paddingBottom = '0.5rem';
        terminalHeader.style.marginBottom = '0.75rem';
        terminalHeader.textContent = '[ILLUSTRATIVE CODE ARCHIVE: c_programming_lab.c]';

        const pre = document.createElement('pre');
        pre.style.fontFamily = 'var(--font-mono)';
        pre.style.fontSize = '0.85rem';
        pre.style.lineHeight = '1.6';
        pre.style.color = '#000000';
        pre.style.overflowX = 'auto';
        pre.textContent = [
          '/* Academic Exercise: Structured Memory & Pointers */',
          '#include <stdio.h>',
          '#include <stdlib.h>',
          '',
          'int main(void) {',
          '    int *buffer = (int *)malloc(sizeof(int) * 8);',
          '    if (buffer == NULL) {',
          '        fprintf(stderr, "Allocation failed.\n");',
          '        return 1;',
          '    }',
          '    printf("Status: Allocated at address %p\n", (void*)buffer);',
          '    free(buffer);',
          '    return 0;',
          '}'
        ].join('\n');

        terminalWrapper.appendChild(terminalHeader);
        terminalWrapper.appendChild(pre);
        lightboxCustomContent.appendChild(terminalWrapper);
      }
    } else if (isAbstract) {
      if (lightboxCustomContent) {
        lightboxCustomContent.style.display = 'block';

        const card = document.createElement('div');
        card.style.border = '1px dashed #000000';
        card.style.padding = '3rem 1.5rem';
        card.style.textAlign = 'center';
        card.style.maxWidth = '500px';
        card.style.margin = '0 auto';
        card.style.backgroundColor = '#FFFFFF';

        const caption = document.createElement('div');
        caption.style.fontFamily = 'var(--font-mono)';
        caption.style.fontSize = '1.5rem';
        caption.style.fontWeight = '800';
        caption.style.letterSpacing = '0.1em';
        caption.style.color = '#000000';
        caption.textContent = 'EDITORIAL POSTER STUDY';

        const sub = document.createElement('div');
        sub.style.fontFamily = 'var(--font-mono)';
        sub.style.fontSize = '0.85rem';
        sub.style.marginTop = '0.75rem';
        sub.style.letterSpacing = '0.16em';
        sub.style.color = '#000000';
        sub.textContent = 'MONOCHROME COMPOSITION ARCHIVE';

        card.appendChild(caption);
        card.appendChild(sub);
        lightboxCustomContent.appendChild(card);
      }
    } else if (src && lightboxImage) {
      lightboxImage.onerror = () => {
        if (currentRequestId !== activeLightboxRequestId) return;
        renderLightboxImageFallback(src);
      };

      lightboxImage.onload = () => {
        if (currentRequestId !== activeLightboxRequestId) return;
        lightboxImage.style.display = 'block';
      };

      lightboxImage.alt = title;
      lightboxImage.src = src;
    }

    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    updatePageScrollLock();

    if (lightboxCloseBtn) {
      lightboxCloseBtn.focus();
    }
  }

  function closeLightbox() {
    if (!lightboxModal) return;

    activeLightboxRequestId += 1;
    const elementToRestore = lastActiveElementBeforeLightbox;
    lastActiveElementBeforeLightbox = null;

    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    updatePageScrollLock();

    if (lightboxImage) {
      lightboxImage.onerror = null;
      lightboxImage.onload = null;
      lightboxImage.style.display = 'none';
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }

    if (lightboxCustomContent) {
      lightboxCustomContent.style.display = 'none';
      lightboxCustomContent.replaceChildren();
    }

    if (isElementSafelyFocusable(elementToRestore)) {
      elementToRestore.focus();
    }
  }

  expandButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(btn);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  // ==========================================================================
  // 8. RESUME DOWNLOAD HANDLER (NATIVE BROWSER DOWNLOAD PRESERVED)
  // ==========================================================================
  // Native HTML anchor attributes are preserved directly on .resume-trigger links:
  // href="assets/resume.pdf" download="Vaishnavi_Dwivedi_Resume.pdf"

  // ==========================================================================
  // 9. CONTACT FORM VALIDATION & CONFIRMATION MAILTO FLOW
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const recipientEmail = 'vaishnavidwivedi.work@gmail.com';

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('messageSubject');
      const messageInput = document.getElementById('messageBody');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        showSystemNotice(
          'Incomplete Message Fields',
          'Please complete all fields (name, email address, subject, and message) before preparing your message.'
        );
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        showSystemNotice(
          'Invalid Email Address',
          'Please provide a valid email address format (e.g., name@example.com) so that I can reply to your inquiry.'
        );
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const emailBody = encodeURIComponent(
        `Hello Vaishnavi,\n\n${messageVal}\n\n---\nSender: ${nameVal}\nEmail: ${emailVal}`
      );
      const mailtoUrl = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

      showSystemNotice(
        'Email Draft Ready',
        'Your email draft is ready. Click Continue to open your default email application.',
        () => {
          window.location.href = mailtoUrl;
          contactForm.reset();
        },
        'Continue'
      );
    });
  }

  // ==========================================================================
  // 10. GLOBAL ESCAPE KEY & TOPMOST DISMISSAL
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (systemModal && systemModal.classList.contains('is-open')) {
        hideSystemNotice(false);
      } else if (lightboxModal && lightboxModal.classList.contains('is-open')) {
        closeLightbox();
      } else if (navMenu && navMenu.classList.contains('is-active')) {
        closeMobileNav(true);
      }
    }
  });

  // ==========================================================================
  // 11. ACTIVE NAVIGATION SCROLL SPY
  // ==========================================================================
  const trackedSections = Array.from(document.querySelectorAll('section[id]'));
  const mainNavLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
  let currentActiveSectionId = null;

  function setActiveNavLink(sectionId) {
    if (!sectionId || sectionId === currentActiveSectionId) return;
    currentActiveSectionId = sectionId;

    mainNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isMatch = href === `#${sectionId}`;
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActiveNavOnScroll() {
    if (trackedSections.length === 0 || mainNavLinks.length === 0) return;

    const headerOffset = navbar ? navbar.getBoundingClientRect().height + 60 : 140;
    const scrollPosition = window.scrollY + headerOffset;
    let matchedSectionId = null;

    for (let i = 0; i < trackedSections.length; i += 1) {
      const section = trackedSections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        matchedSectionId = section.getAttribute('id');
        break;
      }
    }

    if (!matchedSectionId && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      matchedSectionId = trackedSections[trackedSections.length - 1].getAttribute('id');
    }

    if (matchedSectionId) {
      setActiveNavLink(matchedSectionId);
    }
  }

  if (trackedSections.length > 0 && mainNavLinks.length > 0) {
    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    window.addEventListener('hashchange', () => {
      const hashId = window.location.hash ? window.location.hash.slice(1) : '';
      if (hashId && trackedSections.some((sec) => sec.getAttribute('id') === hashId)) {
        setActiveNavLink(hashId);
      } else {
        updateActiveNavOnScroll();
      }
    });

    const initialHashId = window.location.hash ? window.location.hash.slice(1) : '';
    if (initialHashId && trackedSections.some((sec) => sec.getAttribute('id') === initialHashId)) {
      setActiveNavLink(initialHashId);
    } else {
      updateActiveNavOnScroll();
    }
  }

  // ==========================================================================
  // 12. EDITORIAL SCROLL REVEAL ENGINE (FAIL-SAFE PROGRESSIVE ENHANCEMENT)
  // ==========================================================================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    let revealObserver = null;
    const assignedRevealElements = [];

    try {
      const revealTargets = [
        '.section-label',
        '.section-title',
        '.editorial-statement',
        '.section-description',
        '.section-desc',
        '.about-narrative-col > p',
        '.skill-category',
        '.project-item',
        '.experience-block',
        '.education-entry',
        '.resume-banner',
        '.contact-info-col',
        '.form-wrapper'
      ];

      const elementsToReveal = document.querySelectorAll(revealTargets.join(', '));

      if (elementsToReveal.length > 0) {
        const groupContainers = document.querySelectorAll('.skills-editorial-grid, .portfolio-grid');
        groupContainers.forEach((group) => {
          const children = Array.from(group.children).filter(
            (child) => !child.classList.contains('is-hidden')
          );
          children.forEach((child, idx) => {
            child.setAttribute('data-stagger', String((idx % 6) + 1));
          });
        });

        revealObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.12
          }
        );

        elementsToReveal.forEach((el) => {
          el.classList.add('reveal-item');
          assignedRevealElements.push(el);
          revealObserver.observe(el);
        });

        document.documentElement.classList.add('js-reveals');
      }
    } catch (_err) {
      if (revealObserver) {
        revealObserver.disconnect();
      }
      assignedRevealElements.forEach((el) => {
        el.classList.remove('reveal-item', 'is-revealed');
      });
      document.documentElement.classList.remove('js-reveals');
    }
  }
});
