(() => {
  'use strict';
  const data = window.CROWRULES_HOLIDAY_HUBS || [];
  const grid = document.querySelector('#holiday-hub-grid');
  const search = document.querySelector('#hub-search');
  const category = document.querySelector('#hub-category');
  const month = document.querySelector('#hub-month');
  const count = document.querySelector('#hub-count');
  if (!grid || !category || !month) return;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  [...new Set(data.map(h => h.category))].sort().forEach(value => { const option=document.createElement('option'); option.value=value; option.textContent=value; category.append(option); });
  months.forEach((name,index)=>{const option=document.createElement('option');option.value=String(index+1);option.textContent=name;month.append(option);});
  const formatDate = value => new Date(value+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  function render(){
    const term=(search?.value||'').trim().toLowerCase();
    const selectedCategory=category.value;
    const selectedMonth=month.value;
    const results=data.filter(h=>(selectedCategory==='all'||h.category===selectedCategory)&&(selectedMonth==='all'||String(Number(h.date.slice(5,7)))===selectedMonth)&&(h.name+' '+h.description+' '+h.category+' '+h.region+' '+h.traditions).toLowerCase().includes(term));
    grid.replaceChildren();
    if(count)count.textContent=results.length+' holiday hub'+(results.length===1?'':'s');
    if(!results.length){const empty=document.createElement('p');empty.className='empty-state';empty.textContent='No matching holiday hubs. Try another search or filter.';grid.append(empty);return;}
    results.forEach(h=>{
      const card=document.createElement('article');card.className='holiday-hub-card';
      const meta=document.createElement('p');meta.className='hub-card-meta';meta.textContent=formatDate(h.date)+' · '+h.category;
      const title=document.createElement('h3');title.textContent=h.name;
      const desc=document.createElement('p');desc.textContent=h.description;
      const link=document.createElement('a');link.className='text-link';link.href='holiday.html?id='+encodeURIComponent(h.slug);link.textContent='Explore this holiday hub →';
      card.append(meta,title,desc,link);grid.append(card);
    });
  }
  search?.addEventListener('input',render);category.addEventListener('change',render);month.addEventListener('change',render);render();
})();
