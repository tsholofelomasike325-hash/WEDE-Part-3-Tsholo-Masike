/* ==========================================================================
   Programmes page - render PROGRAMMES from data.js with live search
   and category filters. Supports ?category=skills in the URL.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("programme-grid");
  const searchInput = document.getElementById("programme-search");
  const filterWrap = document.getElementById("programme-filters");
  const countEl = document.getElementById("result-count");
  const noResults = document.getElementById("no-results");
  const clearBtn = document.getElementById("clear-search");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeCategory = CATEGORIES[params.get("category")] ? params.get("category") : "all";

  // Build filter buttons from the category list
  const filters = [["all", "All"], ...Object.entries(CATEGORIES)];
  filters.forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.category = key;
    btn.textContent = label;
    btn.setAttribute("aria-pressed", String(key === activeCategory));
    btn.addEventListener("click", () => {
      activeCategory = key;
      filterWrap.querySelectorAll(".filter-btn").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      render();
    });
    filterWrap.appendChild(btn);
  });

  searchInput.addEventListener("input", render);

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "all";
    filterWrap.querySelectorAll(".filter-btn").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.category === "all"))
    );
    render();
    searchInput.focus();
  });

  function matches(programme, term) {
    if (!term) return true;
    const haystack = [
      programme.title,
      programme.description,
      programme.audience,
      programme.schedule,
      CATEGORIES[programme.category],
      ...programme.keywords
    ].join(" ").toLowerCase();
    // Every word typed must appear somewhere (case-insensitive)
    return term.split(/\s+/).every((word) => haystack.includes(word));
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function highlight(text, term) {
    if (!term) return escapeHtml(text);
    const words = term.split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    // Split on matches first, then escape each piece, so markup can't break
    return text
      .split(new RegExp(`(${words.join("|")})`, "gi"))
      .map((part, i) => (i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
      .join("");
  }

  function card(p, term) {
    return `
      <article class="card">
        <img src="${p.image}" alt="${escapeHtml(p.alt)}" width="1200" height="800" loading="lazy">
        <div class="card-body">
          <span class="tag">${CATEGORIES[p.category]}</span>
          <h3>${highlight(p.title, term)}</h3>
          <p>${highlight(p.description, term)}</p>
          <ul class="service-meta">
            <li><strong>Who it's for:</strong> ${highlight(p.audience, term)}</li>
            <li><strong>When:</strong> ${highlight(p.schedule, term)}</li>
          </ul>
          <a class="btn btn-primary" href="enquiry.html?type=programme&amp;programme=${p.id}">Enquire about this</a>
        </div>
      </article>`;
  }

  function render() {
    const term = searchInput.value.trim().toLowerCase();
    const results = PROGRAMMES.filter(
      (p) => (activeCategory === "all" || p.category === activeCategory) && matches(p, term)
    );

    grid.innerHTML = results.map((p) => card(p, term)).join("");
    noResults.hidden = results.length > 0;

    const where = activeCategory === "all" ? "" : ` in ${CATEGORIES[activeCategory]}`;
    const query = term ? ` matching "${searchInput.value.trim()}"` : "";
    countEl.textContent = `Showing ${results.length} of ${PROGRAMMES.length} programmes${where}${query}.`;
    document.getElementById("no-results-term").textContent = searchInput.value.trim() || CATEGORIES[activeCategory] || "";
  }

  render();
});
