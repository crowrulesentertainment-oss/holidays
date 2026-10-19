(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const hubs = window.CROWRULES_HOLIDAY_HUBS || [];
  const params = new URLSearchParams(location.search);
  const aliases = {'christmas-day':'christmas','easter-sunday-western':'easter','mothers-day-us':'mothers-day','memorial-day-us':'memorial-day','veterans-day-us':'veterans-day','ramadan-begins-estimated':'ramadan','holi-date-may-vary':'holi','eid-al-fitr-estimated':'eid-al-fitr','eid-al-adha-estimated':'eid-al-adha','diwali-estimated':'diwali','hanukkah-begins-at-sundown':'hanukkah','rosh-hashanah-begins-at-sundown':'rosh-hashanah','yom-kippur-begins-at-sundown':'yom-kippur','passover-begins-at-sundown':'passover','kwanzaa-begins':'kwanzaa','new-years-day-2027':'new-years-day'};
  const id = aliases[params.get('id')] || params.get('id');
  const hub = hubs.find(item => item.slug === id);
  if (!hub) return;
  const normalized = (hub.name || 'holiday').replace(/[’']/g, '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  const searchUrl = term => 'https://www.google.com/search?q=' + encodeURIComponent([normalized, term].filter(Boolean).join(' '));
  const variableDate = /lunar|estimated|date varies|date vary|verify local|begins at sundown|spring equinox|solstice|equinox|orthodox|movable|observation/i.test([hub.region,hub.description,hub.category].join(' ')) ||
    ['easter','passover','ramadan','eid-al-fitr','eid-al-adha','holi','diwali','hanukkah','rosh-hashanah','yom-kippur','thanksgiving','memorial-day','labor-day','presidents-day','mothers-day','fathers-day','kwanzaa'].includes(hub.slug);
  const countdown = byId('hub-countdown');
  const status = byId('hub-countdown-status');
  const note = byId('hub-countdown-note');
  function renderCountdown() {
    if (variableDate) {
      status.textContent = 'Date confirmation needed';
      note.textContent = 'This observance can shift by calendar, region, or local tradition. Confirm the date with a trusted local or community source before relying on a countdown.';
      countdown.innerHTML = '<div class="hub-countdown-verify" role="status">Please verify the local observance date before setting a countdown.</div>';
      return;
    }
    const parts = String(hub.date || '').split('-').map(Number);
    if (parts.length !== 3 || !parts.every(Number.isFinite)) {
      status.textContent = 'Date not available';
      note.textContent = 'A reliable date has not been supplied for this hub.';
      countdown.innerHTML = '<div class="hub-countdown-verify">Date to be confirmed.</div>';
      return;
    }
    const now = new Date();
    let target = new Date(now.getFullYear(), parts[1]-1, parts[2], 0, 0, 0, 0);
    if (target <= now) target = new Date(now.getFullYear()+1, parts[1]-1, parts[2], 0, 0, 0, 0);
    const ms = target - now;
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms % 86400000 / 3600000);
    const minutes = Math.floor(ms % 3600000 / 60000);
    const seconds = Math.floor(ms % 60000 / 1000);
    countdown.innerHTML = [[days,'Days'],[hours,'Hours'],[minutes,'Minutes'],[seconds,'Seconds']].map(([n,label]) => '<div><strong>'+n+'</strong><span>'+label+'</span></div>').join('');
    status.textContent = 'Live countdown';
    note.textContent = 'Counting down to ' + target.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'}) + ' in your browser’s local time zone.';
  }
  renderCountdown();
  if (!variableDate) window.setInterval(renderCountdown, 1000);

  const visualThemes = [
    {title:'The colors', symbol:'✦', cls:'palette', text:'Color, light, and atmosphere'},
    {title:'The details', symbol:'❋', cls:'details', text:'Decorations and handmade touches'},
    {title:'The gathering', symbol:'◈', cls:'gathering', text:'People, place, and shared moments'},
    {title:'The table', symbol:'✺', cls:'table', text:'Food traditions and seasonal flavors'}
  ];
  byId('hub-gallery').innerHTML = visualThemes.map(item => '<article class="hub-gallery-tile hub-gallery-'+item.cls+'"><span aria-hidden="true">'+item.symbol+'</span><div><h3>'+item.title+'</h3><p>'+item.text+'</p></div></article>').join('');

  const activityIdeas = [
    {title:'Make a memory card', text:'Write one thing you appreciate, one story you want to remember, and one wish for the season.'},
    {title:'Create a family tradition', text:'Choose a low-cost activity everyone can adapt: a walk, a shared playlist, a craft, or a story circle.'},
    {title:'Community kindness challenge', text:'Plan one respectful act of service, learning, or support connected to the people and history behind this observance.'},
    {title:'Holiday scavenger hunt', text:'Find five colors, symbols, sounds, or objects that represent what this celebration means to your household.'}
  ];
  byId('hub-activity-pack').innerHTML = activityIdeas.map((item,i) => '<article class="hub-activity-card"><span class="hub-activity-number">0'+(i+1)+'</span><h3>'+item.title+'</h3><p>'+item.text+'</p><label class="hub-check"><input type="checkbox"> Completed</label></article>').join('');
  byId('hub-print-activities').addEventListener('click', () => window.print());

  const recipes = [
    {title:'A shared seasonal snack', time:'15 MIN', ingredients:'Fruit or vegetables in season · a simple dip · optional herbs or spices', steps:'Wash and prepare the produce. Arrange it on a platter, serve the dip separately, and label common allergens.'},
    {title:'One-pot family favorite', time:'30–45 MIN', ingredients:'Grains or potatoes · vegetables · beans or another protein · broth or seasoning', steps:'Cook the base ingredients until tender. Add vegetables and protein, season to taste, and keep dietary alternatives separate.'},
    {title:'No-bake celebration bites', time:'20 MIN', ingredients:'Oats or crisp cereal · seed or nut butter · honey or syrup · optional dried fruit', steps:'Mix ingredients, shape into small bites, chill until firm, and clearly label allergens. Swap ingredients to suit dietary needs.'}
  ];
  byId('hub-recipes').innerHTML = recipes.map((item,i) => '<article class="hub-recipe-card"><div class="hub-recipe-top"><span>IDEA 0'+(i+1)+'</span><span>'+item.time+'</span></div><h3>'+item.title+'</h3><p><b>Ingredients</b><br>'+item.ingredients+'</p><p><b>Method</b><br>'+item.steps+'</p><button type="button" class="text-link hub-print-recipe" data-recipe="'+i+'">Print this idea ↗</button></article>').join('');
  byId('hub-recipes').addEventListener('click', event => {
    const button = event.target.closest('[data-recipe]');
    if (!button) return;
    document.querySelectorAll('.hub-recipe-card').forEach((card,index) => card.classList.toggle('print-focus', index === Number(button.dataset.recipe)));
    window.print();
    document.querySelectorAll('.hub-recipe-card').forEach(card => card.classList.remove('print-focus'));
  });

  const media = [
    {title:'Holiday music', text:'Discover songs, traditional music, and community artists.', term:'official holiday music playlist'},
    {title:'Stories & explainers', text:'Learn about history and traditions from credible, community-led sources.', term:'history traditions educational video'},
    {title:'Family watchlist', text:'Find seasonal films and short videos; check ratings and rights before sharing publicly.', term:'family holiday film official'}
  ];
  byId('hub-media-collections').innerHTML = media.map(item => '<article class="hub-media-card"><span aria-hidden="true">▶</span><h3>'+item.title+'</h3><p>'+item.text+'</p><a href="'+searchUrl(item.term)+'" target="_blank" rel="noopener noreferrer">Explore collection ↗</a></article>').join('');
  byId('hub-events-title').textContent = 'Find '+hub.name+' events';
  byId('hub-events-description').textContent = 'Search for '+hub.name+' events, workshops, family activities, cultural programs, and community gatherings.';
  byId('hub-events-link').href = searchUrl('events near me');
  byId('hub-events-link').setAttribute('aria-label','Search the web for '+hub.name+' events near me');
})();