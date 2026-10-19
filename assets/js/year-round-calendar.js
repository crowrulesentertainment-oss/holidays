(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const grid = $('#holiday-grid');
  if (!grid) return;

  const search = $('#holiday-search');
  const monthFilter = $('#month-filter');
  const regionFilter = $('#region-filter');
  const yearFilter = $('#calendar-year-filter');
  const resultCount = $('#calendar-result-count');
  const currentYear = new Date().getFullYear();
  const firstYear = Math.max(2026, currentYear);
  const years = [firstYear, firstYear + 1, firstYear + 2];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const localDate = (year, month, day) => new Date(year, month - 1, day, 12);
  const nthWeekday = (year, month, weekday, nth) => {
    const d = localDate(year, month, 1);
    return 1 + ((weekday - d.getDay() + 7) % 7) + (nth - 1) * 7;
  };
  const lastWeekday = (year, month, weekday) => {
    const d = localDate(year, month + 1, 0);
    return d.getDate() - ((d.getDay() - weekday + 7) % 7);
  };
  const observed = (year, month, day) => {
    const d = localDate(year, month, day);
    if (d.getDay() === 6) d.setDate(d.getDate() - 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d;
  };
  const westernEaster = year => {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return localDate(year, month, day);
  };
  const events = [];
  const add = (name, date, region, category, description, source, status = 'Rule-based date') => {
    events.push({name, date: iso(date), region, category, description, source, status});
  };
  years.forEach(year => {
    const fixed = [
      ['New Year’s Day',1,1,'global','International','Welcome a new calendar year.'],
      ['Valentine’s Day',2,14,'global','Seasonal','Celebrate care, friendship and meaningful connections.'],
      ['International Women’s Day',3,8,'global','International','Recognize women’s achievements and contributions.'],
      ['April Fools’ Day',4,1,'global','Cultural','A day associated with pranks and playful traditions; customs vary.'],
      ['Earth Day',4,22,'global','Environment','Take practical action to care for the planet.'],
      ['May Day / International Workers’ Day',5,1,'global','International','Recognize workers and diverse spring traditions around the world.'],
      ['World Environment Day',6,5,'global','Environment','Explore local conservation and environmental action.'],
      ['International Friendship Day',7,30,'global','Community','Reconnect with a friend or celebrate community.'],
      ['Halloween',10,31,'global','Seasonal','Costumes, pumpkins and spooky stories; local customs vary.'],
      ['World Children’s Day',11,20,'global','International','Reflect on children’s rights, safety and wellbeing.'],
      ['Christmas Day',12,25,'christian','Religious / cultural','A Christian holiday also marked culturally by many households.'],
      ['New Year’s Eve',12,31,'global','New Year','Reflect on the year and welcome what comes next.']
    ];
    fixed.forEach(([name,month,day,region,category,description]) => add(name, localDate(year,month,day), region, category, description, 'Fixed annual date'));
    const us = [
      ['Martin Luther King Jr. Day',localDate(year,1,nthWeekday(year,1,1,3))],
      ['Washington’s Birthday (Presidents’ Day)',localDate(year,2,nthWeekday(year,2,1,3))],
      ['Memorial Day',localDate(year,5,lastWeekday(year,5,1))],
      ['Juneteenth National Independence Day',observed(year,6,19)],
      ['Independence Day (observed)',observed(year,7,4)],
      ['Labor Day',localDate(year,9,nthWeekday(year,9,1,1))],
      ['Columbus Day / Indigenous Peoples’ Day (regional observance)',localDate(year,10,nthWeekday(year,10,1,2))],
      ['Veterans Day (observed)',observed(year,11,11)],
      ['Thanksgiving Day',localDate(year,11,nthWeekday(year,11,4,4))],
      ['Christmas Day (federal observed date)',observed(year,12,25)]
    ];
    us.forEach(([name,date]) => add(name,date,'US','US federal / civic','U.S. federal holiday schedule; state, local, tribal and employer observances may differ.','U.S. Office of Personnel Management'));
    add('Mother’s Day (US)',localDate(year,5,nthWeekday(year,5,0,2)),'US','Family','Observed on the second Sunday in May in the United States.','Annual date rule');
    add('Father’s Day (US)',localDate(year,6,nthWeekday(year,6,0,3)),'US','Family','Observed on the third Sunday in June in the United States.','Annual date rule');
    add('St. Patrick’s Day',localDate(year,3,17),'global','Cultural','A feast day associated with Irish heritage and diaspora celebrations.','Fixed annual date');
    add('Cinco de Mayo',localDate(year,5,5),'global','Cultural / historical','Commemorates the Battle of Puebla; it is not Mexico’s Independence Day.','Fixed annual date');
    add('Juneteenth (calendar date)',localDate(year,6,19),'US','Heritage','Commemorates the end of slavery in the United States; local celebrations vary.','Fixed annual date');
    add('Pride Month begins',localDate(year,6,1),'global','Community / heritage','Pride events and dates vary by city and community.','Calendar marker');
    add('Independence Day (calendar date)',localDate(year,7,4),'US','Civic','U.S. national holiday; federal employee observed date may shift on weekends.','Fixed annual date');
    add('Veterans Day (calendar date)',localDate(year,11,11),'US','Remembrance','Honor U.S. military veterans for their service.','Fixed annual date');
    add('Kwanzaa begins',localDate(year,12,26),'US','Heritage','A seven-day cultural celebration honoring African heritage and community values.','Fixed annual date');
    const easter = westernEaster(year);
    add('Easter Sunday (Western)',easter,'christian','Christian','Western Christian Easter date; Eastern Orthodox dates may differ.','Gregorian computus');
    const goodFriday = new Date(easter); goodFriday.setDate(goodFriday.getDate() - 2);
    add('Good Friday (Western)',goodFriday,'christian','Christian','Date calculated from Western Easter; local observance varies.','Gregorian computus');
  });
  events.sort((a,b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  if (yearFilter) {
    yearFilter.replaceChildren();
    const all = document.createElement('option'); all.value = 'all'; all.textContent = 'All years'; yearFilter.append(all);
    years.forEach(year => { const option = document.createElement('option'); option.value = String(year); option.textContent = String(year); yearFilter.append(option); });
    yearFilter.value = String(currentYear >= firstYear && currentYear <= firstYear + 2 ? currentYear : firstYear);
  }
  if (monthFilter && !monthFilter.options.length) {
    const all = document.createElement('option'); all.value='all'; all.textContent='All months'; monthFilter.append(all);
  }
  const render = () => {
    const term = (search?.value || '').trim().toLowerCase();
    const month = monthFilter?.value || 'all';
    const region = regionFilter?.value || 'all';
    const year = yearFilter?.value || 'all';
    const filtered = events.filter(event => {
      const d = new Date(event.date + 'T12:00:00');
      const regionMatch = region === 'all' || event.region === region || (region === 'global' && event.region === 'global');
      return (year === 'all' || event.date.slice(0,4) === year) &&
        (month === 'all' || String(d.getMonth() + 1) === month) && regionMatch &&
        (event.name + ' ' + event.description + ' ' + event.category + ' ' + event.date).toLowerCase().includes(term);
    });
    grid.replaceChildren();
    if (resultCount) resultCount.textContent = filtered.length + ' date' + (filtered.length === 1 ? '' : 's') + ' shown · ' + years[0] + '–' + years[2];
    if (!filtered.length) {
      const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'No matching dates. Try another year, month or search.'; grid.append(empty); return;
    }
    filtered.forEach(event => {
      const card = document.createElement('article'); card.className = 'holiday-card';
      const date = document.createElement('div'); date.className = 'holiday-date';
      date.textContent = new Date(event.date + 'T12:00:00').toLocaleDateString(undefined,{weekday:'short',month:'long',day:'numeric',year:'numeric'});
      const tag = document.createElement('span'); tag.className = 'holiday-tag'; tag.textContent = event.category;
      const title = document.createElement('h3'); title.textContent = event.name;
      const desc = document.createElement('p'); desc.textContent = event.description;
      const meta = document.createElement('small'); meta.className = 'calendar-source-note'; meta.textContent = event.source + ' · ' + event.status;
      card.append(date,tag,title,desc,meta); grid.append(card);
    });
  };
  search?.addEventListener('input',render);
  monthFilter?.addEventListener('change',render);
  regionFilter?.addEventListener('change',render);
  yearFilter?.addEventListener('change',render);
  render();
})();