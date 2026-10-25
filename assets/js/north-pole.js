(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const workshopKey = "crowrules-holiday-northpole-workshop-v1";
  const letterKey = "crowrules-holiday-northpole-letter-v1";
  const favoriteKey = "crowrules-holiday-northpole-favorite-reindeer-v1";
  const keepsakeKey = "crowrules-holiday-northpole-keepsakes-v1";
  const boxes = [...document.querySelectorAll('#workshop-missions input[type="checkbox"]')];
  const workshopFeedback = $("#workshop-feedback");
  try {
    const saved = JSON.parse(localStorage.getItem(workshopKey) || "[]");
    boxes.forEach(box => box.checked = Array.isArray(saved) && saved.includes(box.value));
  } catch {}
  const updateWorkshopProgress = () => {
    const checked = boxes.filter(box => box.checked).length;
    if (workshopFeedback) workshopFeedback.textContent = checked ? `${checked} of ${boxes.length} workshop missions complete — saved on this device.` : "Your checklist is saved only in this browser.";
  };
  boxes.forEach(box => box.addEventListener("change", () => {
    try { localStorage.setItem(workshopKey, JSON.stringify(boxes.filter(item => item.checked).map(item => item.value))); }
    catch { if (workshopFeedback) workshopFeedback.textContent = "Browser storage is unavailable, so this checklist may not persist."; return; }
    updateWorkshopProgress();
  }));
  updateWorkshopProgress();

  const favoriteReindeer = $("#favorite-reindeer");
  const favoriteFeedback = $("#favorite-feedback");
  try {
    const favorite = localStorage.getItem(favoriteKey);
    if (favoriteReindeer && favorite) { favoriteReindeer.value = favorite; favoriteFeedback.textContent = `Your stable favorite is ${favorite}. Saved on this device.`; }
  } catch {}
  favoriteReindeer?.addEventListener("change", () => {
    try {
      if (favoriteReindeer.value) {
        localStorage.setItem(favoriteKey, favoriteReindeer.value);
        favoriteFeedback.textContent = `Your stable favorite is ${favoriteReindeer.value}. Saved on this device.`;
      } else {
        localStorage.removeItem(favoriteKey);
        favoriteFeedback.textContent = "Choose a reindeer to save your stable favorite.";
      }
    } catch { favoriteFeedback.textContent = "Browser storage is unavailable, so your choice may not persist."; }
  });

  const letterForm = $("#letter-form"), letterFeedback = $("#letter-feedback");
  const readKeepsakes = () => {
    try { const items = JSON.parse(localStorage.getItem(keepsakeKey) || "[]"); return Array.isArray(items) ? items : []; }
    catch { return []; }
  };
  const writeKeepsakes = items => localStorage.setItem(keepsakeKey, JSON.stringify(items));
  const typeLabels = {wish:"Wish letter","thank-you":"Thank-you note",kindness:"Kindness note",memory:"Holiday memory"};
  const renderKeepsakes = () => {
    const target = $("#saved-letters"), items = readKeepsakes();
    $("#letter-count").textContent = `${items.length} saved`;
    if (!items.length) { target.innerHTML = '<p class="np-small">No keepsakes saved yet. Write a letter above and choose save.</p>'; return; }
    target.innerHTML = items.map(item => `<article class="np-saved-letter"><div><strong>${escapeHtml(typeLabels[item.type] || "Holiday letter")}</strong><small>${escapeHtml(item.savedAt || "")}</small></div><p>${escapeHtml(item.letter).replace(/\n/g,"<br>")}</p><div class="np-letter-actions"><button type="button" class="np-button np-button-outline np-load-letter" data-id="${escapeHtml(item.id)}">Open in editor</button><button type="button" class="np-button np-button-outline np-delete-letter" data-id="${escapeHtml(item.id)}">Delete</button></div></article>`).join("");
    target.querySelectorAll(".np-load-letter").forEach(button => button.addEventListener("click", () => {
      const item = readKeepsakes().find(entry => entry.id === button.dataset.id);
      if (!item) return;
      letterForm.elements.namedItem("type").value = item.type || "wish";
      letterForm.elements.namedItem("name").value = item.name || "";
      letterForm.elements.namedItem("letter").value = item.letter || "";
      letterFeedback.textContent = "Keepsake opened in the editor. Saving it again creates another copy.";
      letterForm.scrollIntoView({behavior:"smooth",block:"center"});
    }));
    target.querySelectorAll(".np-delete-letter").forEach(button => button.addEventListener("click", () => {
      try { writeKeepsakes(readKeepsakes().filter(entry => entry.id !== button.dataset.id)); renderKeepsakes(); letterFeedback.textContent = "Keepsake deleted from this browser."; }
      catch { letterFeedback.textContent = "Could not delete the keepsake. Check browser storage settings."; }
    }));
  };
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  // Workshop project lab: guided, low-cost activities saved locally.
  const projectKey = "crowrules-holiday-northpole-projects-v1";
  const projects = {
    "kindness-card": {title:"Kindness card",level:"Easy · 10–15 minutes",materials:["Paper or a reused greeting card","Crayons, pencils, or markers","Optional stickers"],steps:["Fold the paper into a card.","Write one specific thing you appreciate about the recipient.","Decorate the front with a winter picture or favorite colors.","Give it in person or leave it somewhere appropriate for them to find."]},
    "paper-snowflakes": {title:"Paper snowflakes",level:"Easy · 10 minutes",materials:["Plain paper","Child-safe scissors (adult help as needed)","Pencil (optional)"],steps:["Fold a square or trimmed sheet of paper into a triangle.","Fold again and draw a few simple shapes along the edges.","Carefully cut small shapes, keeping some folded edges connected.","Open slowly and display your unique snowflake."]},
    "gift-tags": {title:"Handmade gift tags",level:"Easy · 15 minutes",materials:["Scrap paper or thin cardboard","Scissors","Markers","String or ribbon and a hole punch (optional)"],steps:["Cut the paper into small tag shapes.","Write the recipient's name or a short kind message.","Decorate with simple patterns or seasonal colors.","Add a hole and string if available; attach only when gift wrapping."]},
    "recycled-ornament": {title:"Recycled-material ornament",level:"Easy · 20 minutes",materials:["Clean cardboard from packaging","Paper scraps","Glue or tape","Markers and string (optional)"],steps:["Cut cardboard into a simple star, circle, or tree shape.","Cover with paper scraps or draw a design.","Let any glue dry fully before handling.","Add a string loop if you have one, or use it as a tabletop decoration."]},
    "cozy-cocoa-kit": {title:"Cozy cocoa kindness kit",level:"Easy · 10 minutes",materials:["A clean mug or small bag","Sealed cocoa packet or a favorite tea sachet","A handwritten note","Optional wrapped treat"],steps:["Choose a clean mug or small gift bag.","Add a sealed drink packet and any optional shelf-stable treat.","Write a warm note or an invitation to share a cozy break.","Give it to someone who would appreciate a little encouragement. Check allergies and household rules first."]}
  };
  const projectSelect = $("#project-select"), projectDetails = $("#project-details");
  const projectFeedback = $("#project-feedback"), savedProjects = $("#saved-projects");
  const readProjects = () => { try { const value = JSON.parse(localStorage.getItem(projectKey) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
  const renderProject = () => {
    if (!projectSelect || !projectDetails) return;
    const project = projects[projectSelect.value] || projects["kindness-card"];
    projectDetails.innerHTML = `<h4>${project.title}</h4><p class="np-project-level">${project.level}</p><h5>Materials</h5><ul>${project.materials.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul><h5>Steps</h5><ol>${project.steps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
  };
  const renderSavedProjects = () => {
    if (!savedProjects) return;
    const items = readProjects();
    $("#project-count").textContent = `${items.length} saved`;
    if (!items.length) { savedProjects.innerHTML = '<p class="np-small">No saved projects yet. Choose a project and save it above.</p>'; return; }
    savedProjects.innerHTML = items.map(item => `<article class="np-saved-project"><div><strong>${escapeHtml(projects[item.key]?.title || "Workshop project")}</strong><small>${escapeHtml(item.savedAt || "")}</small></div><button type="button" class="np-button np-button-outline np-remove-project" data-id="${escapeHtml(item.id)}">Remove</button></article>`).join("");
    savedProjects.querySelectorAll(".np-remove-project").forEach(button => button.addEventListener("click", () => {
      try { localStorage.setItem(projectKey, JSON.stringify(readProjects().filter(item => item.id !== button.dataset.id))); renderSavedProjects(); projectFeedback.textContent = "Project removed from your list."; }
      catch { projectFeedback.textContent = "Could not update your list. Check browser storage settings."; }
    }));
  };
  projectSelect?.addEventListener("change", renderProject);
  $("#save-project")?.addEventListener("click", () => {
    try {
      const items = readProjects(), key = projectSelect.value;
      if (items.some(item => item.key === key)) { projectFeedback.textContent = "That project is already in your saved list."; return; }
      items.unshift({id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `project-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,key,savedAt:new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})});
      localStorage.setItem(projectKey, JSON.stringify(items));
      projectFeedback.textContent = `${projects[key].title} saved on this device.`;
      renderSavedProjects();
    } catch { projectFeedback.textContent = "Could not save this project. Your browser may have storage disabled."; }
  });
  renderProject();
  renderSavedProjects();

  // Migrate the previous single-draft saved letter into the new keepsake collection once.
  try {
    const old = JSON.parse(localStorage.getItem(letterKey) || "null");
    if (old && old.letter && !localStorage.getItem(keepsakeKey)) {
      writeKeepsakes([{...old,id:"legacy-letter",savedAt:"Previously saved"}]);
    }
  } catch {}
  letterForm?.addEventListener("submit", event => {
    event.preventDefault();
    const item = {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `letter-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      type:letterForm.elements.namedItem("type").value,
      name:letterForm.elements.namedItem("name").value.trim(),
      letter:letterForm.elements.namedItem("letter").value.trim(),
      savedAt:new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})
    };
    if (!item.letter) { letterFeedback.textContent = "Write a few words before saving your letter."; return; }
    try {
      const items = readKeepsakes(); items.unshift(item); writeKeepsakes(items);
      letterFeedback.textContent = "Letter saved to your keepsakes on this device. Nothing was sent or uploaded.";
      renderKeepsakes();
    } catch { letterFeedback.textContent = "Could not save the letter. Your browser may have storage disabled."; }
  });
  $("#clear-letter")?.addEventListener("click", () => {
    letterForm.reset();
    letterFeedback.textContent = "The editor is clear. Saved keepsakes are unchanged.";
  });
  renderKeepsakes();

  const stops = {
    "north-pole": {title:"North Pole departure",description:"The village lights glow as the story begins. The sleigh is ready for its imaginary journey.",symbol:"✦",progress:0,x:"20%",y:"27%",label:"NORTH POLE",step:0},
    "pacific": {title:"Across the Pacific",description:"In our story, the sleigh sweeps over the vast Pacific beneath a sky full of stars.",symbol:"✧",progress:20,x:"38%",y:"38%",label:"PACIFIC",step:1},
    "north-america": {title:"North America",description:"A storybook stop for neighborhoods, cozy windows, and small acts of generosity.",symbol:"❄",progress:40,x:"31%",y:"32%",label:"NORTH AMERICA",step:2},
    "europe": {title:"Europe & Africa",description:"The imaginary route crosses old cities, villages, and warm lights on a winter night.",symbol:"✦",progress:60,x:"55%",y:"39%",label:"EUROPE & AFRICA",step:3},
    "asia": {title:"Asia & Oceania",description:"Our festive journey continues across many places and traditions around the world.",symbol:"✧",progress:80,x:"72%",y:"34%",label:"ASIA & OCEANIA",step:4},
    "home": {title:"Back home to the North Pole",description:"The story closes as the sleigh returns home and the workshop settles into a peaceful glow.",symbol:"✦",progress:100,x:"20%",y:"27%",label:"NORTH POLE",step:5}
  };
  const selector = $("#route-stop");
  const renderStop = () => {
    const stop = stops[selector?.value] || stops["north-pole"];
    $("#route-title").textContent = stop.title;
    $("#route-description").textContent = stop.description;
    $("#route-symbol").textContent = stop.symbol;
    $("#route-progress").style.width = stop.progress + "%";
    $("#map-pin").style.left = stop.x;
    $("#map-pin").style.top = stop.y;
    $("#map-label").style.left = stop.x;
    $("#map-label").style.top = `calc(${stop.y} + 27px)`;
    $("#map-label").textContent = stop.label;
    $("#route-itinerary")?.querySelectorAll("li").forEach((item,index) => {
      item.classList.toggle("is-current",index === stop.step);
      item.classList.toggle("is-complete",index < stop.step);
      if (index === stop.step) item.setAttribute("aria-current","step"); else item.removeAttribute("aria-current");
    });
  };
  selector?.addEventListener("change", renderStop);
  renderStop();
})();