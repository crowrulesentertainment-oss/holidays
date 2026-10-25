(() => {
  const data = window.HOLIDAY_DATA || [];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthNotes = [
    "Fresh starts and winter traditions across many communities.",
    "New-year celebrations and seasonal festivals in many regions.",
    "Spring renewal, new-year observances, and festivals of color.",
    "Environmental action and springtime traditions.",
    "A month to explore diverse faith, culture, and community observances.",
    "Freedom, heritage, and the changing season.",
    "Summer gatherings and local cultural celebrations.",
    "A chance to explore regional and community traditions.",
    "Harvest season begins in some regions, with many local observances.",
    "Light, remembrance, and autumn festivals in many communities.",
    "Harvest gatherings, remembrance, and family traditions.",
    "Winter festivals, faith traditions, and year-end reflection."
  ];
  const monthMap = {
    "new-year":[0], "lunar-new-year":[0,1], "nowruz":[2], "holi":[1,2], "earth-day":[3],
    "juneteenth":[5], "midsummer":[5,6], "diwali":[9,10], "dia-de-los-muertos":[10],
    "thanksgiving-us":[10], "kwanzaa":[11,0], "winter-solstice":[11], "christmas":[11], "hanukkah":[11,0]
  };
  const variableIds = ["ramadan-eid","passover","easter","vesak"];
  const select = document.querySelector("#calendar-month");
  const title = document.querySelector("#calendar-month-title");
  const summary = document.querySelector("#calendar-month-summary");
  const grid = document.querySelector("#calendar-holidays");
  const variable = document.querySelector("#calendar-variable-holidays");
  if (!select || !grid || !title) return;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const card = item => `<a class="holiday-card" href="holiday.html?id=${encodeURIComponent(item.id)}"><span class="holiday-card-top"><span class="holiday-category">${escapeHtml(item.category)}</span><span class="card-arrow">↗</span></span><span class="holiday-date">${escapeHtml(item.date)}</span><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p><span class="holiday-card-bottom">Explore the story <span>→</span></span></a>`;
  const render = () => {
    const month = Number(select.value);
    title.innerHTML = `${monthNames[month]} <em>celebrations.</em>`;
    summary.textContent = monthNotes[month];
    const items = data.filter(item => (monthMap[item.id] || []).includes(month) && !variableIds.includes(item.id));
    grid.innerHTML = items.length ? items.map(card).join("") : '<p class="muted">We are expanding this month’s guide. Explore the full directory for more celebrations.</p>';
    variable.innerHTML = data.filter(item => variableIds.includes(item.id)).map(item => `<a class="variable-holiday" href="holiday.html?id=${encodeURIComponent(item.id)}"><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.region)}</small></span><span class="variable-date">${escapeHtml(item.date)}</span><span aria-hidden="true">↗</span></a>`).join("");
  };
  document.querySelector("#calendar-prev")?.addEventListener("click", () => { select.value = String((Number(select.value) + 11) % 12); render(); });
  document.querySelector("#calendar-next")?.addEventListener("click", () => { select.value = String((Number(select.value) + 1) % 12); render(); });
  select.addEventListener("change", render);
  render();
})();