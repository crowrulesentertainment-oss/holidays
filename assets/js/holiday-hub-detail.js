(() => {
  'use strict';
  const hubs=window.CROWRULES_HOLIDAY_HUBS||[];
  const slug=new URLSearchParams(window.location.search).get('id');
  const aliases={'christmas-day':'christmas','easter-sunday-western':'easter','mothers-day-us':'mothers-day','memorial-day-us':'memorial-day','veterans-day-us':'veterans-day','ramadan-begins-estimated':'ramadan','holi-date-may-vary':'holi','eid-al-fitr-estimated':'eid-al-fitr','eid-al-adha-estimated':'eid-al-adha','diwali-estimated':'diwali','hanukkah-begins-at-sundown':'hanukkah','rosh-hashanah-begins-at-sundown':'rosh-hashanah','yom-kippur-begins-at-sundown':'yom-kippur','passover-begins-at-sundown':'passover','kwanzaa-begins':'kwanzaa','new-years-day-2027':'new-years-day'};
  const hub=hubs.find(item=>item.slug===(aliases[slug]||slug));
  const byId=id=>document.getElementById(id);
  if(!hub){
    byId('holiday-hub-title').textContent='Find your holiday.';
    byId('holiday-hub-description').textContent='Choose a celebration from the full collection of CrowRules holiday hubs.';
    byId('holiday-hub-about').textContent='Each hub gathers a starting point for learning, celebrating, and discovering seasonal ideas.';
    byId('holiday-hub-region').textContent='Browse the collection to find a hub.';
    byId('holiday-hub-traditions').textContent='Explore traditions, activities, and local events with respect for the people who celebrate.';
    byId('holiday-hub-food').textContent='Discover food ideas and family recipes while respecting dietary needs.';
    byId('holiday-hub-media').textContent='Find stories, playlists, interviews, and seasonal features.';
    byId('holiday-hub-date').textContent='Curated collection';
    byId('holiday-hub-category').textContent='Holiday hub';
    return;
  }
  document.title=hub.name+' | CrowRules Holidays';
  byId('holiday-hub-title').textContent=hub.name;
  byId('holiday-hub-description').textContent=hub.description;
  byId('holiday-hub-date').textContent=new Date(hub.date+'T12:00:00').toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'});
  byId('holiday-hub-category').textContent=hub.category;
  byId('holiday-hub-about').textContent=hub.description;
  byId('holiday-hub-region').textContent='Traditions and dates: '+hub.region+'. Confirm local details, especially for lunar or religious observances.';
  byId('holiday-hub-traditions').textContent=hub.traditions;
  byId('holiday-hub-food').textContent=hub.food;
  byId('holiday-hub-media').textContent=hub.media;
  const planLink=byId('holiday-plan-link');
  if(planLink) planLink.href='planner.html?holiday='+encodeURIComponent(hub.name);
  const month=Number(hub.date.slice(5,7));
  const season=month===12||month<=2?'winter':month<=5?'spring':month<=8?'summer':'autumn';
  byId('holiday-hub-hero').classList.add('hub-season-'+season);
})();
