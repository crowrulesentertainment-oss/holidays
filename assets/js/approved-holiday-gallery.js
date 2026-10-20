(() => {
  'use strict';
  const gallery=document.getElementById('hub-gallery'),hero=document.getElementById('holiday-hub-hero');
  if(!gallery||!hero)return;
  const p=new URLSearchParams(location.search),aliases={'christmas-day':'christmas','easter-sunday-western':'easter','mothers-day-us':'mothers-day','memorial-day-us':'memorial-day','veterans-day-us':'veterans-day','ramadan-begins-estimated':'ramadan','holi-date-may-vary':'holi','eid-al-fitr-estimated':'eid-al-fitr','eid-al-adha-estimated':'eid-al-adha','diwali-estimated':'diwali','hanukkah-begins-at-sundown':'hanukkah','rosh-hashanah-begins-at-sundown':'rosh-hashanah','yom-kippur-begins-at-sundown':'yom-kippur','passover-begins-at-sundown':'passover','kwanzaa-begins':'kwanzaa','new-years-day-2027':'new-years-day'};
  const slug=aliases[p.get('id')]||p.get('id'),hub=(window.CROWRULES_HOLIDAY_HUBS||[]).find(h=>h.slug===slug);
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  hero.classList.add('holiday-photo-stage');hero.querySelector('h1')?.parentElement?.classList.add('holiday-photo-copy');hero.querySelector('.hub-hero-meta')?.classList.add('holiday-photo-meta');
  const fallback=()=>{
    gallery.classList.add('holiday-gallery-approved');gallery.replaceChildren();
    const card=el('div','holiday-gallery-note');card.append(el('strong','','The story comes first. The photography is next.'));
    card.append(el('p','','This holiday’s local gallery is being curated. No unreviewed search result or remote image is presented as approved photography. Once cleared assets are published, this space will use responsive AVIF/WebP files with a JPEG fallback, descriptive alt text and visible creator/license credits.'));
    const link=el('a','','Explore candidate photographs on Wikimedia Commons');link.href='https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search='+encodeURIComponent((hub?.name||'holiday')+' celebration photography');link.target='_blank';link.rel='noopener noreferrer';card.append(link);gallery.append(card);
    if(!hero.querySelector('.holiday-photo-credit'))hero.append(el('p','holiday-photo-credit','Photography will appear here after licensing, cultural context and accessibility review.'));
  };
  fetch('assets/data/photo-review-manifest.json').then(r=>{if(!r.ok)throw Error('manifest');return r.json();}).then(manifest=>{
    const approved=(manifest.items||[]).filter(i=>i.status==='approved'&&i.holidaySlugs?.includes(slug)&&i.altText&&i.sourceUrl&&i.creator&&i.licenseName&&i.licenseUrl&&i.reviewedBy&&i.reviewedAt&&i.files?.avif&&i.files?.webp&&i.files?.jpg);
    if(!approved.length){fallback();return;}
    const first=approved[0],picture=document.createElement('picture');
    for(const [type,src] of [['image/avif',first.files.avif],['image/webp',first.files.webp]]){const s=el('source');s.type=type;s.srcset=src;picture.append(s);}
    const heroImg=el('img');heroImg.src=first.files.jpg;heroImg.alt=first.altText;heroImg.width=first.displayWidth||1600;heroImg.height=first.displayHeight||1000;heroImg.fetchPriority='high';heroImg.decoding='async';picture.append(heroImg);hero.prepend(picture);hero.classList.add('has-approved-photo');
    hero.querySelector('.holiday-photo-credit')?.remove();const credit=el('p','holiday-photo-credit','Photo: '+first.creator+' · '),license=el('a','',first.licenseName);license.href=first.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';credit.append(license);hero.append(credit);
    gallery.classList.add('holiday-gallery-approved');gallery.replaceChildren();
    approved.forEach((item,index)=>{const fig=el('figure','hub-photo-card'),a=el('a','hub-photo-link');a.href=item.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Open source and license details for '+item.title);
      const pic=document.createElement('picture');for(const [type,src] of [['image/avif',item.files.avif],['image/webp',item.files.webp]]){const s=el('source');s.type=type;s.srcset=src;pic.append(s);}
      const img=el('img','hub-photo-image');img.src=item.files.jpg;img.alt=item.altText;img.loading=index===0?'eager':'lazy';img.decoding='async';img.width=item.displayWidth||1200;img.height=item.displayHeight||800;pic.append(img);a.append(pic);
      const cap=el('figcaption','hub-photo-credit');cap.append(el('strong','holiday-photo-title',item.title),el('span','hub-photo-source','Photo: '+item.creator));const l=el('a','hub-photo-license',item.licenseName);l.href=item.licenseUrl;l.target='_blank';l.rel='noopener noreferrer';cap.append(l);fig.append(a,cap);gallery.append(fig);
    });
  }).catch(fallback);
})();