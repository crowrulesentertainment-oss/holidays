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
    {name:'Valentine’s Day',date:'2026-02-14',month:2,region:'global',category:'Seasonal',description:'Celebrate care, friendship and the people who matter to you.'},
    {name:'Presidents’ Day',date:'2026-02-16',month:2,description:'A US federal holiday observed on the third Monday in February.'},
    {name:'St. Patrick’s Day',date:'2026-03-17',month:3,description:'Enjoy Irish culture, green decorations and community traditions.'},
    {name:'Earth Day',date:'2026-04-22',month:4,description:'Take a practical step to care for the planet we share.'},
    {name:'Mother’s Day (US)',date:'2026-05-10',month:5,description:'Recognize mothers and the people who nurture and care for us.'},
    {name:'Memorial Day (US)',date:'2026-05-25',month:5,description:'Remember and honor US military personnel who died in service.'},
    {name:'Juneteenth',date:'2026-06-19',month:6,description:'Commemorate the end of slavery in the United States.'},
    {name:'Father’s Day (US)',date:'2026-06-21',month:6,description:'Celebrate fathers, father figures and caring mentors.'},
    {name:'Independence Day (US)',date:'2026-07-04',month:7,description:'A US national holiday marked by community celebrations and fireworks.'},
    {name:'Labor Day (US)',date:'2026-09-07',month:9,description:'Recognize workers and the contributions of the labor movement.'},
    {name:'Halloween',date:'2026-10-31',month:10,region:'global',category:'Seasonal',description:'Costumes, pumpkins, spooky stories and neighborhood fun.'},
    {name:'Veterans Day (US)',date:'2026-11-11',month:11,description:'Honor US military veterans for their service.'},
    {name:'Thanksgiving (US)',date:'2026-11-26',month:11,description:'Gather, share a meal and reflect on gratitude.'},
    {name:'Christmas Day',date:'2026-12-25',month:12,region:'christian',category:'Christian / cultural',description:'A Christian holiday also celebrated culturally by many families worldwide.'},
    {name:'New Year’s Eve',date:'2026-12-31',month:12,description:'Reflect on the year and welcome the possibilities ahead.'},
    {name:'New Year’s Day 2027',date:'2027-01-01',month:1,description:'A new calendar year begins.'}
  ];
  const grid = $('#holiday-grid');
  const regionFilter = $('#region-filter');
  const resultCount = $('#calendar-result-count');
  const search = $('#holiday-search');
  const monthFilter = $('#month-filter');
  if (grid && monthFilter) {
    const extraHolidays = [
      ['Lunar New Year','2026-02-17',2,'east-asian','Lunar new year','Celebrated in many East and Southeast Asian communities; customs vary.'],
      ['Ramadan begins (estimated)','2026-02-18',2,'muslim','Islamic','Start depends on lunar sighting and may differ by country.'],
      ['Holi (date may vary)','2026-03-04',3,'hindu','Hindu','Spring festival observed by many Hindu communities; verify local dates.'],
      ['International Women’s Day','2026-03-08',3,'global','International','Recognize the achievements and contributions of women worldwide.'],
      ['Eid al-Fitr (estimated)','2026-03-20',3,'muslim','Islamic','Date depends on lunar observation and local announcements.'],
      ['Nowruz','2026-03-20',3,'global','New year','Persian New Year and spring equinox celebrated by diverse communities.'],
      ['Passover begins (at sundown)','2026-04-01',4,'jewish','Jewish','Begins at sundown; verify local calendar details.'],
      ['Easter Sunday (Western)','2026-04-05',4,'christian','Christian','Eastern Orthodox Easter may fall on a different date.'],
      ['Eid al-Adha (estimated)','2026-05-27',5,'muslim','Islamic','Date can vary by country and lunar observation.'],
      ['Rosh Hashanah begins (at sundown)','2026-09-11',9,'jewish','Jewish','Jewish New Year; check the local calendar.'],
      ['Yom Kippur begins (at sundown)','2026-09-20',9,'jewish','Jewish','Day of Atonement; observance begins at sundown.'],
      ['Diwali (estimated)','2026-11-08',11,'hindu','Hindu','Festival of lights; dates and customs vary by community.'],
      ['Hanukkah begins (at sundown)','2026-12-04',12,'jewish','Jewish','Festival of Lights; confirm local calendar details.'],
      ['Kwanzaa begins','2026-12-26',12,'US','Cultural','Week-long celebration of African American culture and community values.']
    ].map(([name,date,month,region,category,description])=>({name,date,month,region,category,description}));
    holidayData.push(...extraHolidays);
    holidayData.forEach(h=>{if(!h.region)h.region='US';if(!h.category)h.category='Observance';});
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    months.forEach((m, i) => { const o = document.createElement('option'); o.value = String(i + 1); o.textContent = m; monthFilter.append(o); });
    const renderHolidays = () => {
      const term = (search?.value || '').trim().toLowerCase();
      const month = monthFilter.value;
      const region = regionFilter?.value || 'all';
      const filtered = holidayData.filter(h => (month === 'all' || String(h.month) === month) && (region === 'all' || h.region === region) && (h.name + ' ' + h.description + ' ' + h.date + ' ' + (h.category||'')).toLowerCase().includes(term));
      grid.replaceChildren();
      if(resultCount) resultCount.textContent = filtered.length + ' observance' + (filtered.length===1?'':'s') + ' shown';
      if (!filtered.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'No matching celebrations. Try another search or month.'; grid.append(empty); return; }
      filtered.forEach(h => {
        const card = document.createElement('article'); card.className = 'holiday-card';
        const date = document.createElement('div'); date.className = 'holiday-date';
        date.textContent = new Date(h.date + 'T12:00:00').toLocaleDateString(undefined, {month:'long',day:'numeric',year:'numeric'});
        const tag = document.createElement('span'); tag.className = 'holiday-tag'; tag.textContent = h.category || 'Observance';
        const title = document.createElement('h3'); title.textContent = h.name;
        const desc = document.createElement('p'); desc.textContent = h.description;
        card.append(date,tag,title,desc); grid.append(card);
      });
    };
    search?.addEventListener('input', renderHolidays);
    monthFilter.addEventListener('change', renderHolidays);
    regionFilter?.addEventListener('change', renderHolidays);
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
  const welcome = $('#santa-welcome');
  const downloadLetter = $('#download-letter');
  let preparedLetter = '';
  if (letter) letter.addEventListener('submit', event => {
    event.preventDefault();
    const name = ($('#first-name')?.value || '').trim();
    const text = ($('#letter-message')?.value || '').trim();
    const feedback = $('#letter-feedback');
    if (!text) { if(feedback) feedback.textContent = 'Add a little note before preparing your letter.'; return; }
    preparedLetter = 'Dear Santa,\\n\\n' + (name ? 'My name is ' + name + '.\\n\\n' : '') + text + '\\n\\nWith holiday cheer,\\n' + (name || 'A friend');
    if (feedback) feedback.textContent = 'Your letter is ready to download. Nothing has been sent or stored.';
    if(downloadLetter) downloadLetter.hidden = false;
  });
})();
  if (welcome) welcome.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { alert('Speech playback is not supported in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance('Ho ho hello! Welcome to the North Pole. I am so glad you stopped by. What would you like to share today?');
    utterance.rate = 0.88; utterance.pitch = 0.9; window.speechSynthesis.speak(utterance);
  });
  if (downloadLetter) downloadLetter.addEventListener('click', () => {
    if (!preparedLetter) return;
    const url = URL.createObjectURL(new Blob([preparedLetter], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href=url; a.download='my-letter-to-santa.txt'; a.click(); URL.revokeObjectURL(url);
  });
  $$('.activity-filter').forEach(button => button.addEventListener('click', () => {
    $$('.activity-filter').forEach(b => b.classList.toggle('active', b===button));
    $$('.activity-card[data-category]').forEach(card => card.hidden = button.dataset.activityFilter !== 'all' && card.dataset.category !== button.dataset.activityFilter);
  }));
