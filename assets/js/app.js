(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const year = new Date().getFullYear();
  $$("[data-year]").forEach(el => el.textContent = year);

  const menuButton = $(".menu-toggle");
  const nav = $("#main-nav");
  if (menuButton && nav) menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("nav-open", !open);
  });

  const data = window.HOLIDAY_DATA || [];
  const card = item => `<a class="holiday-card" href="holiday.html?id=${encodeURIComponent(item.id)}"><span class="holiday-card-top"><span class="holiday-category">${escapeHtml(item.category)}</span><span class="card-arrow">↗</span></span><span class="holiday-date">${escapeHtml(item.date)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p><span class="holiday-card-bottom">Explore the story <span>→</span></span></a>`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const featured = $("#featured-holidays");
  if (featured) featured.innerHTML = data.filter(x => ["christmas","diwali","lunar-new-year","easter"].includes(x.id)).map(card).join("");

  const directory = $("#holiday-directory");
  if (directory) {
    const search = $("#holiday-search"), category = $("#holiday-category"), count = $("#results-count"), noResults = $("#no-results");
    const render = () => {
      const term = search.value.trim().toLowerCase(), cat = category.value;
      const filtered = data.filter(x => (cat === "all" || x.category === cat) && [x.name,x.summary,x.region,x.date,x.category,x.history].join(" ").toLowerCase().includes(term));
      directory.innerHTML = filtered.map(card).join("");
      count.textContent = `${filtered.length} celebration${filtered.length === 1 ? "" : "s"} to explore`;
      noResults.hidden = filtered.length > 0;
    };
    search.addEventListener("input", render); category.addEventListener("change", render);
    $("#clear-filters")?.addEventListener("click", () => { search.value = ""; category.value = "all"; render(); search.focus(); });
    const params = new URLSearchParams(location.search);
    if (params.has("q")) search.value = params.get("q");
    render();
  }

  if ($("#detail-title")) {
    const id = new URLSearchParams(location.search).get("id");
    const item = data.find(x => x.id === id);
    if (item) {
      document.title = `${item.name} — CrowRules Holiday Hub`;
      $("#detail-title").textContent = item.name;
      $("#detail-summary").textContent = item.summary;
      $("#detail-history").innerHTML = `<p>${escapeHtml(item.history)}</p><p><strong>Usual date:</strong> ${escapeHtml(item.date)}. <strong>Community or region:</strong> ${escapeHtml(item.region)}.</p>`;
      $("#detail-traditions").innerHTML = item.traditions.map(t => `<div class="tradition-item"><span>✦</span><div><p>${escapeHtml(t)}</p></div></div>`).join("");
    } else {
      $("#detail-title").textContent = "Choose a holiday to explore.";
      $("#detail-summary").textContent = "This guide is ready for a holiday selected from the directory.";
      $("#detail-history").innerHTML = '<p>Visit the directory to find a celebration, then open its guide for history and traditions.</p><p><a class="text-link" href="holidays.html">Browse the holiday directory ↗</a></p>';
      $("#detail-traditions").innerHTML = "";
    }
  }

  const traditionForm = $("#tradition-form");
  if (traditionForm) {
    const key = "crowrules-holiday-traditions-v1";
    const feedback = $("#tradition-feedback");
    const read = () => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
    const renderSaved = () => {
      const target = $("#saved-traditions"), entries = read();
      if (!entries.length) { target.innerHTML = '<p class="muted">Your saved traditions will appear here. Start with the form above.</p>'; return; }
      target.innerHTML = entries.map((x,i) => `<article class="saved-card"><span class="holiday-category">${escapeHtml(x.occasion)}</span><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.frequency)} · ${escapeHtml(x.people || "Just for me")}</p>${x.meaning ? `<p>${escapeHtml(x.meaning)}</p>` : ""}<button class="text-button remove-tradition" type="button" data-index="${i}">Remove</button></article>`).join("");
      $$(".remove-tradition", target).forEach(btn => btn.addEventListener("click", () => { const list = read(); list.splice(Number(btn.dataset.index),1); localStorage.setItem(key, JSON.stringify(list)); renderSaved(); }));
    };
    traditionForm.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(traditionForm);
      const entry = {name:String(form.get("name")||"").trim(),occasion:String(form.get("occasion")||""),people:String(form.get("people")||"").trim(),frequency:String(form.get("frequency")||""),meaning:String(form.get("meaning")||"").trim(),createdAt:new Date().toISOString()};
      if (!entry.name) { feedback.textContent = "Please give your tradition a name."; return; }
      try { const list = read(); list.unshift(entry); localStorage.setItem(key, JSON.stringify(list)); feedback.textContent = "Your tradition is saved in this browser."; traditionForm.reset(); renderSaved(); }
      catch { feedback.textContent = "This browser could not save the tradition. Check storage settings and try again."; }
    });
    $("#clear-traditions")?.addEventListener("click", () => { if (confirm("Clear all traditions saved in this browser? This cannot be undone.")) { localStorage.removeItem(key); renderSaved(); feedback.textContent = "Saved traditions cleared from this browser."; } });
    renderSaved();
  }

  const countdown = $("#christmas-countdown");
  if (countdown) {
    const updateCountdown = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 11, 25, 0, 0, 0);
      if (now >= target) target = new Date(now.getFullYear()+1, 11, 25, 0, 0, 0);
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000), hours = Math.floor(diff % 86400000 / 3600000), minutes = Math.floor(diff % 3600000 / 60000);
      $("[data-count-days]").textContent = days; $("[data-count-hours]").textContent = String(hours).padStart(2,"0"); $("[data-count-minutes]").textContent = String(minutes).padStart(2,"0");
    };
    updateCountdown(); setInterval(updateCountdown, 60000);
  }

  $$(".recipe-toggle").forEach(btn => btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling, open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open)); panel.hidden = open;
    btn.innerHTML = open ? "Show simple method <span>＋</span>" : "Hide method <span>−</span>";
  }));

  document.addEventListener("keydown", event => {
    if (event.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
      const search = $("#holiday-search"); if (search) { event.preventDefault(); search.focus(); }
    }
  });
})();