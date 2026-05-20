/* ============================================================
   observer.js
   Scroll-driven visibility system for:
     1. .about section — hide/appear as a unit with child stagger
     2. .skills .skill-box — each card hides/appears individually
     3. .animate-on-scroll — generic sections (skills wrapper etc.)

   Classes toggled on each target:
     .hidden  — element is out of view (initial state)
     .visible — element has entered the viewport
     .leaving — element is scrolling out (triggers exit animation)

   The CSS in skills&ResponsiveStyles.css reads these classes
   and applies the matching transition rules.
============================================================ */

(function () {
  'use strict';

  /* ── Scroll-direction tracker ────────────────────────────────────────── */
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';

  window.addEventListener('scroll', () => {
    scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = window.scrollY;
  }, { passive: true });

  /* ── Helper: apply a state class cleanly ───────────────────────────── */
  function setState(el, state) {
    el.classList.remove('hidden', 'visible', 'leaving');
    el.classList.add(state);
  }

  /* ══════════════════════════════════════════════════════════════════════
     1. ABOUT SECTION
     - Threshold array: [0, 0.15, 0.35]
       · 0    → fires when ANY pixel enters/leaves (needed to catch leaving)
       · 0.15 → 15% visible triggers APPEAR
       · 0.35 → used for leaving detection going back up
     - Children stagger is handled purely in CSS via transition-delay
  ══════════════════════════════════════════════════════════════════════ */
  const aboutSection = document.querySelector('.about.animate-on-scroll');

  if (aboutSection) {
    /* Start hidden */
    setState(aboutSection, 'hidden');

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;

        if (entry.isIntersecting && ratio >= 0.15) {
          /* Section has scrolled into view enough — reveal */
          setState(aboutSection, 'visible');
          return;
        }

        if (!entry.isIntersecting) {
          /* Section has left the viewport */
          if (scrollDirection === 'down') {
            /* Scrolled past — hide upward (leaving) */
            setState(aboutSection, 'leaving');
            /* After exit animation completes, snap to hidden so
               re-entering from below starts fresh */
            setTimeout(() => {
              if (aboutSection.classList.contains('leaving')) {
                setState(aboutSection, 'hidden');
              }
            }, 900);
          } else {
            /* Scrolled back up past it — leaving downward */
            setState(aboutSection, 'leaving');
            setTimeout(() => {
              if (aboutSection.classList.contains('leaving')) {
                setState(aboutSection, 'hidden');
              }
            }, 700);
          }
        }
      });
    }, {
      threshold: [0, 0.05, 0.15, 0.35],
      rootMargin: '0px 0px -60px 0px'   /* trigger 60px before bottom edge */
    });

    aboutObserver.observe(aboutSection);
  }

  /* ══════════════════════════════════════════════════════════════════════
     2. SKILLS SECTION WRAPPER
     - Same depth fly-in as the heading uses
     - Threshold 0.08 = appear when 8% visible (large section, enters slowly)
  ══════════════════════════════════════════════════════════════════════ */
  const skillsSection = document.querySelector('.skills.animate-on-scroll');

  if (skillsSection) {
    setState(skillsSection, 'hidden');

    const skillsSectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
          setState(skillsSection, 'visible');
        } else if (!entry.isIntersecting) {
          setState(skillsSection, 'leaving');
          setTimeout(() => {
            if (skillsSection.classList.contains('leaving')) {
              setState(skillsSection, 'hidden');
            }
          }, 800);
        }
      });
    }, {
      threshold: [0, 0.08, 0.25],
      rootMargin: '0px 0px -40px 0px'
    });

    skillsSectionObserver.observe(skillsSection);
  }

  /* ══════════════════════════════════════════════════════════════════════
     3. INDIVIDUAL SKILL BOXES
     - Each box gets its own observer
     - --box-index CSS custom property drives the stagger delay in CSS
     - Threshold 0.20 = card must be 20% visible before appearing
       (prevents cards partially behind viewport edge from triggering)
     - rootMargin bottom -80px pushes the trigger line up — cards
       appear slightly before they fully enter, feel more alive
  ══════════════════════════════════════════════════════════════════════ */
  const skillBoxes = document.querySelectorAll('.skills .skill-box');

  skillBoxes.forEach((box, index) => {
    /* Assign stagger index so CSS transition-delay can use it */
    box.style.setProperty('--box-index', index);

    /* Start hidden */
    setState(box, 'hidden');

    const boxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;

        if (entry.isIntersecting && ratio >= 0.20) {
          setState(box, 'visible');
          return;
        }

        if (!entry.isIntersecting) {
          if (scrollDirection === 'down') {
            /* Card scrolled above viewport — leaving upward */
            setState(box, 'leaving');
            setTimeout(() => {
              if (box.classList.contains('leaving')) {
                setState(box, 'hidden');
              }
            }, 600);
          } else {
            /* Scrolled back up, card going off bottom of viewport */
            setState(box, 'leaving');
            setTimeout(() => {
              if (box.classList.contains('leaving')) {
                setState(box, 'hidden');
              }
            }, 600);
          }
        }
      });
    }, {
      threshold: [0, 0.10, 0.20, 0.50],
      rootMargin: '0px 0px -80px 0px'
    });

    boxObserver.observe(box);
  });

  /* ══════════════════════════════════════════════════════════════════════
     4. GENERIC .animate-on-scroll ELEMENTS
     (anything else tagged with the class — future sections etc.)
     Excludes .about and .skills which have dedicated observers above.
  ══════════════════════════════════════════════════════════════════════ */
  const genericTargets = document.querySelectorAll(
    '.animate-on-scroll:not(.about):not(.skills)'
  );

  genericTargets.forEach(el => {
    setState(el, 'hidden');

    const genericObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          setState(el, 'visible');
        } else if (!entry.isIntersecting) {
          setState(el, 'leaving');
          setTimeout(() => {
            if (el.classList.contains('leaving')) {
              setState(el, 'hidden');
            }
          }, 750);
        }
      });
    }, {
      threshold: [0, 0.12, 0.30],
      rootMargin: '0px 0px -50px 0px'
    });

    genericObserver.observe(el);
  });

})();
