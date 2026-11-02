/* ==========================================================================
   Dobsonville Community Foundation - shared site interactions
   Loaded on every page. Each feature checks its elements exist first,
   so pages only run what they use.
   ========================================================================== */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeaderShadow();
  initBackToTop();
  initReveal();
  initSlider();
  initTabs();
  initAccordion();
  initCounters();
  initOpeningHours();
  initFooterYear();
});

/* ---------- Responsive hamburger navigation ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after choosing a link, pressing Esc or clicking elsewhere
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  // Reset when resizing back up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  });
}

/* ---------- Header shadow once the page scrolls ---------- */
function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 500),
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  });
}

/* ---------- Fade-in sections as they scroll into view ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Image slider (homepage) ---------- */
function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slide");
  const dotsWrap = slider.querySelector(".slider-dots");
  const prev = slider.querySelector(".slider-btn.prev");
  const next = slider.querySelector(".slider-btn.next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer = null;

  const dots = Array.from(slides).map((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show slide ${i + 1} of ${slides.length}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === current)));
  }

  function start() {
    if (!reduceMotion) timer = setInterval(() => goTo(current + 1), 5000);
  }

  function restart() {
    clearInterval(timer);
    start();
  }

  prev.addEventListener("click", () => { goTo(current - 1); restart(); });
  next.addEventListener("click", () => { goTo(current + 1); restart(); });

  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { goTo(current - 1); restart(); }
    if (e.key === "ArrowRight") { goTo(current + 1); restart(); }
  });

  // Pause while the visitor is interacting with the slider
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", () => clearInterval(timer));
  slider.addEventListener("focusout", restart);

  goTo(0);
  start();
}

/* ---------- Accessible tabs (about, partner pages) ---------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const panels = buttons.map((b) => document.getElementById(b.getAttribute("aria-controls")));

    const select = (index, focus = true) => {
      buttons.forEach((btn, i) => {
        const selected = i === index;
        btn.setAttribute("aria-selected", String(selected));
        btn.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      if (focus) buttons[index].focus();
    };

    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => select(i));
      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") select((i + 1) % buttons.length);
        if (e.key === "ArrowLeft") select((i - 1 + buttons.length) % buttons.length);
        if (e.key === "Home") select(0);
        if (e.key === "End") select(buttons.length - 1);
      });
    });

    select(0, false);
  });
}

/* ---------- FAQ accordion (one open at a time) ---------- */
function initAccordion() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion-trigger");

    const close = (trigger) => {
      trigger.setAttribute("aria-expanded", "false");
      document.getElementById(trigger.getAttribute("aria-controls")).style.maxHeight = null;
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        triggers.forEach(close);
        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  });
}

/* ---------- Animated impact counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    // data-plain skips thousands separators (e.g. for years)
    const format = (n) => ("plain" in el.dataset ? String(n) : n.toLocaleString("en-ZA"));
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
}

/* ---------- Highlight today's opening hours + open/closed status ---------- */
function initOpeningHours() {
  const table = document.querySelector("[data-hours]");
  if (!table) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const row = table.querySelector(`tr[data-day="${day}"]`);
  if (row) row.classList.add("today");

  const status = document.querySelector("[data-open-status]");
  if (!status || !row) return;

  const open = Number(row.dataset.open);
  const close = Number(row.dataset.close);
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = !Number.isNaN(open) && hour >= open && hour < close;
  status.textContent = isOpen ? "The centre is open now." : "The centre is closed right now.";
}

/* ---------- Current year in footer ---------- */
function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
