/**
 * VAISHNAVI DWIVEDI — PORTFOLIO SCRIPT ARCHITECTURE
 * Pure Vanilla JavaScript (Zero Dependencies, Zero Frameworks)
 * Strict Monochrome Editorial System — Production Release with Unified Focus Trap & Dynamic Header Height
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // DYNAMIC MOBILE HEADER HEIGHT OBSERVER
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');

  function updateHeaderHeight() {
    if (!siteHeader) return;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  updateHeaderHeight();

  if (window.ResizeObserver && siteHeader) {
    const headerObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });
    headerObserver.observe(siteHeader);
  } else {
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    window.addEventListener('orientationchange', updateHeaderHeight, { passive: true });
  }

  // ==========================================================================
  // 1. DYNAMIC FOOTER COPYRIGHT YEAR
  // ==========================================================================
  const copyrightYearEl = document.getElementById('copyrightYear');
  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // SHARED SCROLL LOCK & UNIFIED TOPMOST FOCUS TRAP
  // ==========================================================================
  const systemModal = document.getElementById('systemModal');
  const lightboxModal = document.getElementById('lightboxModal');

  function updatePageScrollLock() {
    const isSystemModalOpen = systemModal && systemModal.classList.contains('is-open');
    const isLightboxOpen = lightboxModal && lightboxModal.classList.contains('is-open');

    if (isSystemModalOpen || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

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

  // Unified global focus trap: restricts Tab cycling strictly to the topmost open overlay
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const isSystemModalOpen = systemModal && systemModal.classList.contains('is-open');
    const isLightboxOpen = lightboxModal && lightboxModal.classList.contains('is-open');

    if (isSystemModalOpen) {
      trapFocusWithin(systemModal, e);
    } else if (isLightboxOpen) {
      trapFocusWithin(lightboxModal, e);
    }
  });

  // ==========================================================================
  // 2. SYSTEM NOTIFICATION MODAL SYSTEM
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

    if (typeof actionToExecute === 'function') {
      actionToExecute();
      return;
    }

    if (elementToRestore && typeof elementToRestore.focus === 'function') {
      elementToRestore.focus();
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
  // 3. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function openMobileNav() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-active');
  }

  function closeMobileNav() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-active');
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    const allNavLinks = navMenu.querySelectorAll('a');
    allNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // ==========================================================================
  // 4. PORTFOLIO CATEGORY FILTERING
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      projectItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (targetFilter === 'all' || itemCategory === targetFilter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 5. PORTFOLIO EXPANDABLE LIGHTBOX
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

  function openLightbox(triggerBtn) {
    if (!lightboxModal) return;

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
      lightboxImage.style.display = 'none';
      lightboxImage.src = '';
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
        ].join('
');

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
      lightboxImage.style.display = 'block';
      lightboxImage.src = src;
      lightboxImage.alt = title;

      lightboxImage.onerror = () => {
        lightboxImage.style.display = 'none';
        if (lightboxCustomContent) {
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
      };
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

    const elementToRestore = lastActiveElementBeforeLightbox;
    lastActiveElementBeforeLightbox = null;

    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    updatePageScrollLock();

    if (lightboxImage) {
      lightboxImage.src = '';
    }

    if (elementToRestore && typeof elementToRestore.focus === 'function') {
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
  // 6. RESUME DOWNLOAD HANDLER (NATIVE BROWSER DOWNLOAD PRESERVED)
  // ==========================================================================
  // Native HTML anchor attributes are used directly:
  // href="assets/resume.pdf" download="Vaishnavi_Dwivedi_Resume.pdf"
  // No synthetic interception or artificial event blocking is applied.

  // ==========================================================================
  // 7. CONTACT FORM VALIDATION & CONFIRMATION MAILTO FLOW
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
        `Hello Vaishnavi,

${messageVal}

---
Sender: ${nameVal}
Email: ${emailVal}`
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
  // 8. GLOBAL ESCAPE KEY & TOPMOST DISMISSAL
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (systemModal && systemModal.classList.contains('is-open')) {
        hideSystemNotice(false);
      } else if (lightboxModal && lightboxModal.classList.contains('is-open')) {
        closeLightbox();
      } else if (navMenu && navMenu.classList.contains('is-active')) {
        closeMobileNav();
      }
    }
  });

  // ==========================================================================
  // 9. ACTIVE NAVIGATION SCROLL SPY
  // ==========================================================================
  const trackedSections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (trackedSections.length > 0 && mainNavLinks.length > 0) {
    window.addEventListener(
      'scroll',
      () => {
        const scrollPosition = window.pageYOffset + 140;

        trackedSections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            mainNavLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${sectionId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { passive: true }
    );
  }
});
