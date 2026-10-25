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
    const params = new URLSearchParams(location.search);
    let seasonFilter = params.get("season") || "";
    if (seasonFilter === "family") { category.value = "family"; seasonFilter = ""; }
    const render = () => {
      const term = search.value.trim().toLowerCase(), cat = category.value;
      const filtered = data.filter(x => (cat === "all" || x.category === cat) && (!seasonFilter || x.season === seasonFilter) && [x.name,x.summary,x.region,x.date,x.category,x.history].join(" ").toLowerCase().includes(term));
      directory.innerHTML = filtered.map(card).join("");
      count.textContent = `${filtered.length} celebration${filtered.length === 1 ? "" : "s"} to explore`;
      noResults.hidden = filtered.length > 0;
    };
    search.addEventListener("input", render); category.addEventListener("change", render);
    $("#clear-filters")?.addEventListener("click", () => { search.value = ""; category.value = "all"; seasonFilter = ""; render(); search.focus(); });
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
    const submitButton = traditionForm.querySelector('button[type="submit"]');
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "text-button";
    cancelButton.textContent = "Cancel editing";
    cancelButton.hidden = true;
    submitButton.insertAdjacentElement("afterend", cancelButton);
    let editingId = null;
    const read = () => {
      try {
        const entries = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(entries) ? entries.map((x,i) => ({...x,id:x.id || `legacy-${x.createdAt || "saved"}-${i}`,category:x.category || "other",date:x.date || ""})) : [];
      } catch { return []; }
    };
    const write = entries => localStorage.setItem(key, JSON.stringify(entries));
    const resetEditor = () => {
      editingId = null;
      traditionForm.reset();
      submitButton.innerHTML = 'Save My Tradition <span>↗</span>';
      cancelButton.hidden = true;
      feedback.textContent = "";
    };
    const renderSaved = () => {
      const target = $("#saved-traditions"), entries = read();
      if (!entries.length) { target.innerHTML = '<p class="muted">Your saved traditions will appear here. Start with the form above.</p>'; return; }
      target.innerHTML = entries.map(x => `<article class="saved-card"><span class="holiday-category">${escapeHtml(x.occasion)}</span><span class="holiday-category">${escapeHtml(String(x.category).replace(/-/g," "))}</span><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.frequency)} · ${escapeHtml(x.people || "Just for me")}</p>${x.date ? `<p><strong>Next planned:</strong> ${escapeHtml(x.date)}</p>` : ""}${x.meaning ? `<p>${escapeHtml(x.meaning)}</p>` : ""}<div class="saved-card-actions"><button class="text-button edit-tradition" type="button" data-id="${escapeHtml(x.id)}">Edit</button><button class="text-button remove-tradition" type="button" data-id="${escapeHtml(x.id)}">Remove</button></div></article>`).join("");
      $(".edit-tradition", target).forEach(btn => btn.addEventListener("click", () => {
        const entry = read().find(x => x.id === btn.dataset.id);
        if (!entry) return;
        editingId = entry.id;
        ["name","occasion","people","frequency","meaning","category","date"].forEach(field => {
          const input = traditionForm.elements.namedItem(field);
          if (input) input.value = entry[field] || (field === "category" ? "other" : "");
        });
        submitButton.textContent = "Update My Tradition";
        cancelButton.hidden = false;
        feedback.textContent = "Editing a saved tradition. Save your changes when ready.";
        traditionForm.scrollIntoView({behavior:"smooth",block:"start"});
        traditionForm.elements.namedItem("name")?.focus();
      }));
      $(".remove-tradition", target).forEach(btn => btn.addEventListener("click", () => {
        try {
          write(read().filter(x => x.id !== btn.dataset.id));
          if (editingId === btn.dataset.id) resetEditor();
          renderSaved();
          feedback.textContent = "Tradition removed from this browser.";
        } catch { feedback.textContent = "Could not update browser storage. Check storage settings and try again."; }
      }));
    };
    cancelButton.addEventListener("click", resetEditor);
    traditionForm.addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(traditionForm);
      const entry = {id:editingId || (window.crypto?.randomUUID ? window.crypto.randomUUID() : `tradition-${Date.now()}`),name:String(form.get("name")||"").trim(),occasion:String(form.get("occasion")||""),people:String(form.get("people")||"").trim(),frequency:String(form.get("frequency")||""),category:String(form.get("category")||"other"),date:String(form.get("date")||""),meaning:String(form.get("meaning")||"").trim(),createdAt:new Date().toISOString()};
      if (!entry.name) { feedback.textContent = "Please give your tradition a name."; return; }
      try {
        const list = read(), existingIndex = list.findIndex(x => x.id === editingId);
        if (existingIndex >= 0) list[existingIndex] = entry; else list.unshift(entry);
        write(list);
        feedback.textContent = editingId ? "Your tradition has been updated in this browser." : "Your tradition is saved in this browser.";
        resetEditor();
        renderSaved();
      } catch { feedback.textContent = "This browser could not save the tradition. Check storage settings and try again."; }
    });
    $("#clear-traditions")?.addEventListener("click", () => {
      if (confirm("Clear all traditions saved in this browser? This cannot be undone.")) {
        try { localStorage.removeItem(key); resetEditor(); renderSaved(); feedback.textContent = "Saved traditions cleared from this browser."; }
        catch { feedback.textContent = "Could not clear browser storage. Check storage settings and try again."; }
      }
    });
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