(()=>{"use strict";
const $=s=>document.querySelector(s);
const key="crowrules-holiday-favorites-v1";
const activities=[
{id:"kind-note",title:"Write a kindness note",category:"Kindness",description:"Leave a sincere note for someone who helped you, made you smile, or deserves encouragement."},
{id:"shared-story",title:"Share a favorite memory",category:"Together",description:"Invite someone to tell a favorite holiday or family memory."},
{id:"seasonal-window",title:"Make a seasonal window display",category:"Creative",description:"Use paper shapes, drawings, or safe decorations to give one window a seasonal touch."},
{id:"neighborhood-walk",title:"Take a noticing walk",category:"Outdoors",description:"Take a comfortable walk or look outside and notice three colors, sounds, or signs of the season."},
{id:"recipe-card",title:"Save a recipe story",category:"Seasonal",description:"Write down a favorite recipe and the memory connected to it."},
{id:"gratitude-jar",title:"Start a gratitude jar",category:"Creative",description:"Decorate a container and add one small moment you appreciated."},
{id:"helping-hands",title:"Offer one useful helping hand",category:"Kindness",description:"Ask someone what would genuinely help them today."},
{id:"music-share",title:"Make a shared playlist",category:"Together",description:"Invite friends or family to suggest songs for a season or gathering."},
{id:"nature-sketch",title:"Sketch a seasonal detail",category:"Outdoors",description:"Draw a leaf, cloud, branch, flower, or view from a window."},
{id:"paper-garland",title:"Create a paper garland",category:"Creative",description:"Reuse paper scraps to make a chain or garland."},
{id:"family-question",title:"Ask a story question",category:"Together",description:"Ask someone which small tradition they hope you keep."},
{id:"seasonal-kindness",title:"Share a seasonal greeting",category:"Seasonal",description:"Send a greeting to someone who may appreciate being remembered."},
{id:"book-exchange",title:"Swap a favorite read",category:"Together",description:"Recommend a book, poem, comic, or short article."},
{id:"clean-green",title:"Care for one shared space",category:"Kindness",description:"Tidy a shared table or care for a space everyone uses."},
{id:"seasonal-photo",title:"Capture a seasonal detail",category:"Outdoors",description:"Take a photo of a seasonal detail and give it a memorable title."}
];
const read=()=>{try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v.filter(x=>x&&["holiday","activity"].includes(x.type)&&typeof x.id==="string"):[]}catch{return[]}};
const write=v=>localStorage.setItem(key,JSON.stringify(v));
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const data=Array.isArray(window.HOLIDAY_DATA)?window.HOLIDAY_DATA:[];
const select=$("#favorite-holiday-select");
data.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(h=>{const o=document.createElement("option");o.value=h.id;o.textContent=h.name;select.append(o)});
function add(type,id){const list=read();if(list.some(x=>x.type===type&&x.id===id))return false;list.push({type,id,addedAt:new Date().toISOString()});write(list);return true}
function render(){const list=read();$("#favorite-total").textContent=list.length;$("#clear-favorites").disabled=!list.length;
const groups={holiday:$("#favorite-holidays"),activity:$("#favorite-activities")};
for(const type of ["holiday","activity"]){const group=list.filter(x=>x.type===type);const target=groups[type];if(!group.length){target.innerHTML='<p class="passport-empty">'+(type==="holiday"?"No holidays saved yet. Choose one above to begin your passport.":"No activities saved yet. Visit the Activity Center and tap “☆ Favorite.”")+"</p>";continue}
target.innerHTML=group.map(item=>{const h=type==="holiday"?data.find(x=>x.id===item.id):null;const a=type==="activity"?activities.find(x=>x.id===item.id):null;if(type==="holiday"&&!h)return"";if(type==="activity"&&!a)return"";const title=type==="holiday"?h.name:a.title;const desc=type==="holiday"?h.summary:a.description;const meta=type==="holiday"?(h.date+" · "+h.region):a.category;const link=type==="holiday"?"holiday.html?id="+encodeURIComponent(h.id):"activity-center.html#activity-list";return '<article class="passport-card"><span class="passport-label">'+safe(meta)+'</span><h4>'+safe(title)+'</h4><p>'+safe(desc)+'</p><div class="passport-actions">'+(type==="holiday"?'<a href="'+link+'">Read holiday guide ↗</a>':'<a href="'+link+'">Open Activity Center ↗</a>')+'<button type="button" data-remove-type="'+type+'" data-remove-id="'+safe(item.id)+'">Remove favorite</button></div></article>'}).join("")}
document.querySelectorAll("[data-remove-type]").forEach(btn=>btn.addEventListener("click",()=>{write(read().filter(x=>!(x.type===btn.dataset.removeType&&x.id===btn.dataset.removeId)));render()}))
}
$("#favorite-holiday-form").addEventListener("submit",e=>{e.preventDefault();const id=select.value;if(!id)return;try{const added=add("holiday",id);$("#favorite-feedback").textContent=added?"Holiday saved to your passport.":"That holiday is already in your favorites.";render()}catch{$("#favorite-feedback").textContent="Could not save favorites. Check your browser storage settings."}});
$("#clear-favorites").addEventListener("click",()=>{if(!read().length)return;if(!confirm("Clear all holiday and activity favorites from this browser?"))return;try{localStorage.removeItem(key);$("#favorite-feedback").textContent="Your favorites have been cleared.";render()}catch{$("#favorite-feedback").textContent="Could not clear favorites."}});
window.CROWRULES_HOLIDAY_FAVORITES={key,read,add,remove:(type,id)=>{write(read().filter(x=>!(x.type===type&&x.id===id)))}};
render();
})();