(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const workshopKey = "crowrules-holiday-northpole-workshop-v1";
  const letterKey = "crowrules-holiday-northpole-letter-v1";
  const boxes = [...document.querySelectorAll('#workshop-missions input[type="checkbox"]')];
  const workshopFeedback = $("#workshop-feedback");
  try {
    const saved = JSON.parse(localStorage.getItem(workshopKey) || "[]");
    boxes.forEach(box => box.checked = Array.isArray(saved) && saved.includes(box.value));
  } catch {}
  boxes.forEach(box => box.addEventListener("change", () => {
    try {
      const checked = boxes.filter(item => item.checked).map(item => item.value);
      localStorage.setItem(workshopKey, JSON.stringify(checked));
      workshopFeedback.textContent = checked.length ? `${checked.length} workshop mission${checked.length === 1 ? "" : "s"} checked off — saved on this device.` : "Your checklist is saved only in this browser.";
    } catch { workshopFeedback.textContent = "Browser storage is unavailable, so this checklist may not persist."; }
  }));
  const letterForm = $("#letter-form"), letterFeedback = $("#letter-feedback");
  const loadLetter = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(letterKey) || "null");
      if (!saved) return;
      letterForm.elements.namedItem("type").value = saved.type || "wish";
      letterForm.elements.namedItem("name").value = saved.name || "";
      letterForm.elements.namedItem("letter").value = saved.letter || "";
      letterFeedback.textContent = "Your saved letter was loaded from this device. It has not been sent.";
    } catch {}
  };
  letterForm?.addEventListener("submit", event => {
    event.preventDefault();
    const letter = letterForm.elements.namedItem("letter").value.trim();
    if (!letter) { letterFeedback.textContent = "Write a few words before saving your letter."; return; }
    const item = {type:letterForm.elements.namedItem("type").value,name:letterForm.elements.namedItem("name").value.trim(),letter};
    try { localStorage.setItem(letterKey, JSON.stringify(item)); letterFeedback.textContent = "Letter saved on this device. Nothing was sent or uploaded."; }
    catch { letterFeedback.textContent = "Could not save the letter. Your browser may have storage disabled."; }
  });
  $("#clear-letter")?.addEventListener("click", () => {
    letterForm.reset();
    try { localStorage.removeItem(letterKey); letterFeedback.textContent = "Draft cleared from this form and this device."; }
    catch { letterFeedback.textContent = "Draft cleared from the form."; }
  });
  loadLetter();
  const stops = {
    "north-pole": {title:"North Pole departure",description:"The village lights glow as the story begins. The sleigh is ready for its imaginary journey.",symbol:"✦",progress:0,x:"20%",y:"27%",label:"NORTH POLE"},
    "pacific": {title:"Across the Pacific",description:"In our story, the sleigh sweeps over the vast Pacific beneath a sky full of stars.",symbol:"✧",progress:20,x:"38%",y:"38%",label:"PACIFIC"},
    "north-america": {title:"North America",description:"A storybook stop for neighborhoods, cozy windows, and small acts of generosity.",symbol:"❄",progress:40,x:"31%",y:"32%",label:"NORTH AMERICA"},
    "europe": {title:"Europe & Africa",description:"The imaginary route crosses old cities, villages, and warm lights on a winter night.",symbol:"✦",progress:60,x:"55%",y:"39%",label:"EUROPE & AFRICA"},
    "asia": {title:"Asia & Oceania",description:"Our festive journey continues across many places and traditions around the world.",symbol:"✧",progress:80,x:"72%",y:"34%",label:"ASIA & OCEANIA"},
    "home": {title:"Back home to the North Pole",description:"The story closes as the sleigh returns home and the workshop settles into a peaceful glow.",symbol:"✦",progress:100,x:"20%",y:"27%",label:"NORTH POLE"}
  };
  const selector = $("#route-stop");
  const renderStop = () => {
    const stop = stops[selector.value] || stops["north-pole"];
    $("#route-title").textContent = stop.title;
    $("#route-description").textContent = stop.description;
    $("#route-symbol").textContent = stop.symbol;
    $("#route-progress").style.width = stop.progress + "%";
    $("#map-pin").style.left = stop.x;
    $("#map-pin").style.top = stop.y;
    $("#map-label").style.left = stop.x;
    $("#map-label").style.top = `calc(${stop.y} + 27px)`;
    $("#map-label").textContent = stop.label;
  };
  selector?.addEventListener("change", renderStop);
  renderStop();
})();