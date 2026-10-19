(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = $('.menu-toggle');
  const nav = $('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  const holidayData = [
    {name:'New Year’s Day',date:'2026-01-01',month:1,description:'Welcome a fresh year with hopes, plans and new beginnings.'},
    {name:'Martin Luther King Jr. Day',date:'2026-01-19',month:1,description:'A US federal observance honoring the life and legacy of Dr. King.'},
    {name:'Valentine’s Day',date:'2026-02-14',month:2,description:'Celebrate care, friendship and the people who matter to you.'},
    {name:'Presidents’ Day',date:'2026-02-16',month:2,description:'A US federal holiday observed on the third Monday in February.'},
    {name:'St. Patrick’s Day',date:'2026-03-17',month:3,description:'Enjoy Irish culture, green decorations and community traditions.'},
    {name:'Earth Day',date:'2026-04-22',month:4,description:'Take a practical step to care for the planet we share.'},
    {name:'Mother’s Day (US)',date:'2026-05-10',month:5,description:'Recognize mothers and the people who nurture and care for us.'},
    {name:'Memorial Day (US)',date:'2026-05-25',month:5,description:'Remember and honor US military personnel who died in service.'},
    {name:'Juneteenth',date:'2026-06-19',month:6,description:'Commemorate the end of slavery in the United States.'},
    {name:'Father’s Day (US)',date:'2026-06-21',month:6,description:'Celebrate fathers, father figures and caring mentors.'},
    {name:'Independence Day (US)',date:'2026-07-04',month:7,description:'A US national holiday marked by community celebrations and fireworks.'},
    {name:'Labor Day (US)',date:'2026-09-07',month:9,description:'Recognize workers and the contributions of the labor movement.'},
    {name:'Halloween',date:'2026-10-31',month:10,description:'Costumes, pumpkins, spooky stories and neighborhood fun.'},
    {name:'Veterans Day (US)',date:'2026-11-11',month:11,description:'Honor US military veterans for their service.'},
    {name:'Thanksgiving (US)',date:'2026-11-26',month:11,description:'Gather, share a meal and reflect on gratitude.'},
    {name:'Christmas Day',date:'2026-12-25',month:12,description:'A Christian holiday also celebrated culturally by many families worldwide.'},
    {name:'New Year’s Eve',date:'2026-12-31',month:12,description:'Reflect on the year and welcome the possibilities ahead.'},
    {name:'New Year’s Day 2027',date:'2027-01-01',month:1,description:'A new calendar year begins.'}
  ];
  const grid = $('#holiday-grid');
  const search = $('#holiday-search');
  const monthFilter = $('#month-filter');
  if (grid && monthFilter) {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    months.forEach((m, i) => { const o = document.createElement('option'); o.value = String(i + 1); o.textContent = m; monthFilter.append(o); });
    const renderHolidays = () => {
      const term = (search?.value || '').trim().toLowerCase();
      const month = monthFilter.value;
      const filtered = holidayData.filter(h => (month === 'all' || String(h.month) === month) && (h.name + ' ' + h.description + ' ' + h.date).toLowerCase().includes(term));
      grid.replaceChildren();
      if (!filtered.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'No matching celebrations. Try another search or month.'; grid.append(empty); return; }
      filtered.forEach(h => {
        const card = document.createElement('article'); card.className = 'holiday-card';
        const date = document.createElement('div'); date.className = 'holiday-date';
        date.textContent = new Date(h.date + 'T12:00:00').toLocaleDateString(undefined, {month:'long',day:'numeric',year:'numeric'});
        const title = document.createElement('h3'); title.textContent = h.name;
        const desc = document.createElement('p'); desc.textContent = h.description;
        card.append(date,title,desc); grid.append(card);
      });
    };
    search?.addEventListener('input', renderHolidays);
    monthFilter.addEventListener('change', renderHolidays);
    renderHolidays();
  }

  const timer = $('#featured-timer');
  const title = $('#featured-title');
  const dateLabel = $('#featured-date');
  const message = $('#featured-message');
  let timerInterval;
  function setCountdown(name, date) {
    if (!timer) return;
    if (timerInterval) clearInterval(timerInterval);
    timer.dataset.target = date;
    if (title) title.textContent = name;
    if (dateLabel) dateLabel.textContent = new Date(date).toLocaleString(undefined,{month:'long',day:'numeric',year:'numeric'});
    const tick = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) {
        $$('[data-days],[data-hours],[data-minutes],[data-seconds]',timer).forEach(el => el.textContent = '00');
        if (message) message.textContent = name + ' is here! Wishing you a wonderful celebration.';
        return;
      }
      const values = {
        '[data-days]': Math.floor(diff / 86400000),
        '[data-hours]': Math.floor(diff / 3600000) % 24,
        '[data-minutes]': Math.floor(diff / 60000) % 60,
        '[data-seconds]': Math.floor(diff / 1000) % 60
      };
      Object.entries(values).forEach(([sel,val]) => { const el = $(sel,timer); if(el) el.textContent = String(val).padStart(sel.includes('days') ? 3 : 2,'0'); });
      if (message) message.textContent = 'The magic is on its way. Every moment brings ' + name + ' closer.';
    };
    tick(); timerInterval = setInterval(tick,1000);
    $$('.countdown-card').forEach(card => card.classList.toggle('selected',card.dataset.title === name));
  }
  $$('.countdown-card').forEach(card => card.addEventListener('click', () => setCountdown(card.dataset.title,card.dataset.date)));
  if (timer) setCountdown('Christmas Day',timer.dataset.target);

  const letter = $('#santa-letter');
  if (letter) letter.addEventListener('submit', event => {
    event.preventDefault();
    const name = ($('#first-name')?.value || '').trim();
    const text = ($('#letter-message')?.value || '').trim();
    const feedback = $('#letter-feedback');
    if (!text) { if(feedback) feedback.textContent = 'Add a little note before preparing your letter.'; return; }
    if (feedback) feedback.textContent = (name ? 'Thank you, ' + name + '! ' : 'Thank you! ') + 'Your letter is ready in this demo. It has not been sent or stored.';
    letter.reset();
  });
})();