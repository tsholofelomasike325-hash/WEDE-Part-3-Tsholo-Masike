/* ==========================================================================
   Gallery page - category filters and an accessible lightbox with
   next/previous, Esc, arrow keys, swipe and click-outside-to-close.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  if (!items.length || !lightbox) return;

  const lbImage = lightbox.querySelector(".lightbox-content img");
  const lbCaption = lightbox.querySelector(".lightbox-caption");
  const lbCounter = lightbox.querySelector(".lightbox-counter");
  const btnClose = lightbox.querySelector(".lightbox-close");
  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  let visible = items; // items matching the current filter
  let current = 0;
  let lastFocused = null;

  /* ---------- Filters ---------- */
  const filterButtons = document.querySelectorAll("#gallery-filters .filter-btn");
  const countEl = document.getElementById("gallery-count");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      items.forEach((item) => {
        item.hidden = category !== "all" && item.dataset.category !== category;
      });
      visible = items.filter((item) => !item.hidden);
      countEl.textContent = `Showing ${visible.length} of ${items.length} photos.`;
    });
  });

  /* ---------- Lightbox ---------- */
  function show(index) {
    current = (index + visible.length) % visible.length;
    const img = visible[current].querySelector("img");
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCaption.textContent = visible[current].querySelector("figcaption").textContent;
    lbCounter.textContent = `Image ${current + 1} of ${visible.length}`;
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.querySelector("button").addEventListener("click", () => open(visible.indexOf(item)));
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  // Click on the dark backdrop (not the image or buttons) closes it
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);

    // Keep keyboard focus inside the lightbox
    if (e.key === "Tab") {
      const focusable = [btnClose, btnPrev, btnNext];
      const i = focusable.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? (i - 1 + focusable.length) % focusable.length : (i + 1) % focusable.length;
      focusable[next].focus();
    }
  });

  // Swipe left/right on touch screens
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
    touchX = null;
  });
});
