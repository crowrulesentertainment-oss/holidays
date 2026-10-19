(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const hubs=window.CROWRULES_HOLIDAY_HUBS||[];
  const count=$('[data-v3-hub-count]'); if(count)count.textContent=String(hubs.length||47);
  const year=$('[data-v3-year]'); if(year)year.textContent=new Date().getFullYear();
  const dateOut=$('[data-v3-today]'); if(dateOut)dateOut.textContent=new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric'}).format(new Date());
  const grid=$('[data-v3-hub-grid]'), search=$('[data-v3-search]'), category=$('[data-v3-category]');
  const safeText=v=>String(v??'');
  // Build filters from the actual dataset so categories never silently mismatch.
  if(category&&hubs.length){
    const selected=category.value||'all';
    const categories=[...new Set(hubs.map(h=>safeText(h.category).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    category.replaceChildren();
    const all=document.createElement('option');all.value='all';all.textContent='All categories';category.append(all);
    categories.forEach(label=>{const option=document.createElement('option');option.value=label.toLowerCase();option.textContent=label;category.append(option);});
    category.value=categories.some(label=>label.toLowerCase()===selected)?selected:'all';
  }
  function renderHubs(){
    if(!grid)return;
    const term=(search?.value||'').trim().toLowerCase(),cat=category?.value||'all';
    const filtered=hubs.filter(h=>(cat==='all'||safeText(h.category).toLowerCase()===cat)&&(safeText(h.name)+' '+safeText(h.description)+' '+safeText(h.region)+' '+safeText(h.category)).toLowerCase().includes(term)).slice(0,12);
    grid.replaceChildren();
    if(!filtered.length){const e=document.createElement('div');e.className='v3-empty';e.textContent='No matching holiday hubs. Try a broader search.';grid.append(e);return;}
    filtered.forEach(h=>{
      const card=document.createElement('article');card.className='v3-hub-card';
      const top=document.createElement('div');const meta=document.createElement('div');meta.className='v3-card-meta';
      const catEl=document.createElement('span');catEl.textContent=safeText(h.category||'Holiday hub');
      const region=document.createElement('span');region.textContent=safeText(h.region||'Various regions');
      meta.append(catEl,region);const title=document.createElement('h3');title.textContent=safeText(h.name);
      const desc=document.createElement('p');desc.textContent=safeText(h.description);
      top.append(meta,title,desc);const link=document.createElement('a');link.href='holiday.html?id='+encodeURIComponent(h.slug);link.textContent='Explore hub →';card.append(top,link);grid.append(card);
    });
  }
  search?.addEventListener('input',renderHubs);category?.addEventListener('change',renderHubs);renderHubs();

  // A private-by-default celebration checklist. Data stays in this browser only.
  const form=$('[data-v3-planner-form]'),list=$('[data-v3-task-list]'),status=$('[data-v3-planner-status]');
  const plannerHoliday=(new URLSearchParams(window.location.search).get('holiday')||'').trim().slice(0,100);
  const plannerHeading=$('[data-v3-planner-heading]');
  const plannerTitle=form?.querySelector('[name="task-title"]');
  if(plannerHoliday){
    if(plannerHeading)plannerHeading.textContent='Plan for '+plannerHoliday;
    if(plannerTitle)plannerTitle.placeholder='Add a task for '+plannerHoliday;
    if(status)status.textContent='You’re planning for '+plannerHoliday+'. Add your own tasks below.';
  }
  const key='crowrules-holidays-v3-planner';
  let tasks=[];
  try{tasks=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(tasks))tasks=[];}catch{tasks=[];}
  function persist(){try{localStorage.setItem(key,JSON.stringify(tasks));if(status)status.textContent='Saved in this browser only. Nothing has been uploaded.';}catch{if(status)status.textContent='This browser could not save the list. You can still use it during this visit.';}}
  function renderTasks(){
    if(!list)return;list.replaceChildren();
    if(!tasks.length){const empty=document.createElement('li');empty.className='v3-empty';empty.textContent='Your plan is a blank page. Add a task to get started.';list.append(empty);return;}
    tasks.forEach(task=>{
      const li=document.createElement('li');li.className='v3-task'+(task.done?' done':'');
      const check=document.createElement('input');check.type='checkbox';check.checked=!!task.done;check.setAttribute('aria-label','Mark '+task.title+' complete');
      check.addEventListener('change',()=>{task.done=check.checked;persist();renderTasks();});
      const copy=document.createElement('div');copy.className='v3-task-copy';const title=document.createElement('strong');title.textContent=task.title;const meta=document.createElement('small');meta.textContent=[task.date,task.category].filter(Boolean).join(' · ')||'No date set';copy.append(title,meta);
      const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);persist();renderTasks();});
      li.append(check,copy,remove);list.append(li);
    });
  }
  form?.addEventListener('submit',event=>{
    event.preventDefault();const title=$('[name="task-title"]',form)?.value.trim();if(!title){if(status)status.textContent='Add a task name first.';return;}
    tasks.unshift({id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),title,date:$('[name="task-date"]',form)?.value||'',category:$('[name="task-category"]',form)?.value||'General',done:false});
    form.reset();persist();renderTasks();
  });
  $('[data-v3-clear-done]')?.addEventListener('click',()=>{tasks=tasks.filter(t=>!t.done);persist();renderTasks();});
  $('[data-v3-export]')?.addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),tasks},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='crowrules-holiday-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  renderTasks();
})();