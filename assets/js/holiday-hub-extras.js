(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const hubs = window.CROWRULES_HOLIDAY_HUBS || [];
  const params = new URLSearchParams(location.search);
  const aliases = {'christmas-day':'christmas','easter-sunday-western':'easter','mothers-day-us':'mothers-day','memorial-day-us':'memorial-day','veterans-day-us':'veterans-day','ramadan-begins-estimated':'ramadan','holi-date-may-vary':'holi','eid-al-fitr-estimated':'eid-al-fitr','eid-al-adha-estimated':'eid-al-adha','diwali-estimated':'diwali','hanukkah-begins-at-sundown':'hanukkah','rosh-hashanah-begins-at-sundown':'rosh-hashanah','yom-kippur-begins-at-sundown':'yom-kippur','passover-begins-at-sundown':'passover','kwanzaa-begins':'kwanzaa','new-years-day-2027':'new-years-day'};
  const id = aliases[params.get('id')] || params.get('id');
  const hub = hubs.find(item => item.slug === id);
  if (!hub) return;
  const cleanName = (hub.name || 'holiday').replace(/[’']/g, '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
  const searchUrl = term => 'https://www.google.com/search?q=' + encodeURIComponent([cleanName, term].filter(Boolean).join(' '));

  // Activities and recipes are intentionally tied to the named observance.
  // Food traditions are diverse; these are suggestions, not claims that every family observes alike.
  const content = {
    'new-years-day': {activities:[['Year-ahead wish cards','Everyone writes one hope, one skill to learn, and one way to help their community.'],['Memory jar','Add favorite moments from the past year and open them together next New Year.']],recipe:['Lucky-food tasting board','Black-eyed peas or lentils, greens, rice, and family-selected dishes','Prepare small tasting portions and label each dish with its family or regional story. Traditions vary by culture.']},
    'lunar-new-year': {activities:[['New-year greeting cards','Make cards with greetings appropriate to a family’s language and tradition.'],['Zodiac story corner','Read a child-friendly account of the zodiac and invite family members to share regional versions.']],recipe:['Longevity noodle bowl','Wheat or rice noodles, broth, greens, mushrooms, scallions, optional tofu or egg','Cook noodles without cutting them short; add toppings separately and explain that dishes and symbolism vary across regions.']},
    'valentines-day': {activities:[['Kindness post office','Make anonymous appreciation notes for classmates, neighbors, or coworkers.'],['Friendship playlist','Each person contributes a song and explains the memory or feeling behind it.']],recipe:['Heart-shaped strawberry toast','Bread, strawberries, yogurt or cream cheese, optional honey','Toast bread, cut fruit into hearts, and assemble. Offer dairy-free alternatives and avoid making romance the only theme.']},
    'presidents-day': {activities:[['Then-and-now timeline','Compare a primary-source image, a speech excerpt, and a current civic issue.'],['Presidential trivia night','Create questions from library or museum sources and include multiple perspectives.']],recipe:['Washington-style cherry hand pies','Cherries, pastry, lemon, sugar or alternative sweetener','Fill pastry rounds with cherries, seal and bake according to pastry directions. Present the historical association as folklore unless a source verifies it.']},
    'black-history-month': {activities:[['Local history map','Research Black inventors, artists, organizers, and leaders connected to your state or town.'],['Read-and-listen circle','Pair a book by a Black author with an interview or oral-history excerpt.']],recipe:['Red-velvet mini cakes','Flour, cocoa, sugar, oil or butter, eggs or substitute, buttermilk or alternative','Bake small cakes from a tested recipe and discuss the many regional food traditions in Black American history; no single dish represents everyone.']},
    'ramadan': {activities:[['Generosity calendar','Plan small, practical acts of charity or service across the month.'],['Community learning questions','Use a trusted Muslim community resource to learn about fasting, prayer, and diverse local practices.']],recipe:['Date-and-oat suhoor bowl','Oats, milk or plant milk, dates, nuts or seeds, fruit','Soak or cook oats until soft and add toppings. Label allergens and remember that fasting practices and meal choices vary; do not frame this as a meal for everyone.']},
    'eid-al-fitr': {activities:[['Eid greeting cards','Create warm greetings and learn how friends or local communities prefer to mark Eid.'],['Giving and gratitude basket','Gather shelf-stable food or donations requested by a local organization.']],recipe:['Date-stuffed celebration bites','Dates, walnuts or sunflower seeds, coconut or sesame','Remove pits, fill with a small amount of filling, and serve with allergen labels. Eid sweets and dishes differ widely by region.']},
    'st-patricks-day': {activities:[['Irish music listening map','Listen to traditional instruments and contemporary Irish artists, noting styles and regions.'],['Irish-language greeting cards','Learn and carefully check a few simple Irish phrases using a reputable language source.']],recipe:['Irish soda bread','Flour, baking soda, buttermilk or soured plant milk, salt','Mix gently, score the top, and bake until cooked through. Avoid presenting one recipe as the only Irish tradition.']},
    'holi': {activities:[['Spring color study','Explore color symbolism through art made with safe materials; participation in powder play should be optional.'],['Holi story and regional traditions','Learn from Hindu community or museum resources about the stories and varied ways Holi is observed.']],recipe:['Thandai-inspired milk drink','Milk or plant milk, cardamom, fennel, saffron optional, almonds or seeds','Infuse spices, chill, and strain if desired. Clearly label nuts and check a trusted recipe for exact proportions.']},
    'international-womens-day': {activities:[['Women’s achievements gallery','Create short profiles of women in science, arts, sports, public service, and local community work.'],['Mentor appreciation notes','Write a note thanking a mentor or identify a practical way to support women-led work.']],recipe:['Women-led local-food spotlight','Ingredients selected from a woman-owned bakery, farm, or restaurant','Feature the business with permission, credit its work accurately, and link to its official menu rather than inventing a signature recipe.']},
    'nowruz': {activities:[['Haft-sin learning table','Learn what each haft-sin item represents from Persian cultural sources before arranging a display.'],['Spring renewal journal','Write intentions for the new year and plan a small act of renewal or hospitality.']],recipe:['Sabzi polo-inspired herb rice','Rice, parsley, cilantro, dill, chives or scallions, oil','Cook rice with finely chopped herbs using a trusted recipe; serve with optional accompaniments and acknowledge regional variations.']},
    'easter': {activities:[['Egg-decorating science','Test natural dyes from cabbage, onion skins, or turmeric; supervise hot water and keep craft eggs separate from food.'],['Spring nature walk','Observe new growth and birds without disturbing nests or wildlife.']],recipe:['Hot cross buns','Flour, yeast, milk or alternative, dried fruit, warm spices','Use a tested yeast-bread recipe, allow time to rise, and mark allergens. Traditions differ across Christian communities and households.']},
    'passover': {activities:[['Seder plate learning cards','Create cards explaining seder-plate symbols using a trusted Jewish educational source.'],['Freedom story discussion','Read an age-appropriate version of the Exodus story and invite reflection without assuming everyone observes alike.']],recipe:['Charoset','Apples, walnuts or sunflower seeds, cinnamon, grape juice or wine according to household practice','Chop or grate ingredients and mix to a family-preferred texture. Check nut allergies and use a trusted Jewish recipe; ingredients vary by tradition.']},
    'earth-day': {activities:[['Neighborhood nature tally','Count birds, pollinators, or litter from a safe route and submit findings to an appropriate citizen-science project.'],['Repair-and-reuse challenge','Choose one item to mend, reuse, or keep out of landfill.']],recipe:['Low-waste seasonal soup','Seasonal vegetables, beans or lentils, stock, herbs','Use suitable leftover vegetables, cook until tender, and refrigerate promptly. Choose local ingredients when practical, not as a purity test.']},
    'mothers-day': {activities:[['Recorded family story','Ask a mother or caregiver what story they want preserved and record only with consent.'],['Care without assumptions','Offer a choice of activity or quiet time, recognizing that family and grief experiences differ.']],recipe:['Breakfast tray favorites','A loved one’s chosen breakfast, fruit, toast, and a warm drink','Ask about preferences in advance, prepare safe hot drinks, and adapt for allergies. The recipient’s own favorite matters more than a fixed menu.']},
    'eid-al-adha': {activities:[['Charity chosen by the community','Ask a local Muslim organization what donations or volunteer support are actually useful.'],['Learn the meaning of Eid','Use community-led sources to explore faith, generosity, and the story behind the observance.']],recipe:['Spiced rice and chickpea platter','Rice, chickpeas, onions, cumin, coriander, optional raisins and herbs','Cook rice and season chickpeas separately, then assemble. This is a flexible gathering dish, not a universal Eid recipe; meat customs vary.']},
    'memorial-day': {activities:[['Remembrance biography','Research one service member who died in service using a veterans’ memorial or archive.'],['Moment of remembrance','Attend a local observance or create a quiet reflection that centers remembrance rather than celebration.']],recipe:['Community picnic potato salad','Potatoes, celery, herbs, mayonnaise or vinaigrette, mustard','Cook potatoes until tender, cool safely, mix with dressing, and keep chilled outdoors. Keep the memorial purpose of the day in view.']},
    'juneteenth': {activities:[['Freedom timeline','Study primary sources about emancipation, June 19, 1865, and the continuing history of freedom struggles.'],['Local Black history walk','Visit a historic site or support a Black-led cultural organization and follow its guidance.']],recipe:['Red drink and fruit table','Hibiscus tea or a labeled red fruit drink, strawberries, watermelon, seasonal fruit','Brew and chill hibiscus tea if using, sweeten to taste, and label ingredients. Red foods are meaningful in many Juneteenth gatherings, but customs vary.']},
    'fathers-day': {activities:[['Ask-me-anything interview','Invite a father figure to share a memory, skill, or lesson; let them skip questions.'],['Build or make together','Choose a hands-on activity based on the recipient’s interests, not stereotypes.']],recipe:['Favorite-flavor grill or roast','Chosen vegetables, tofu, fish, or meat, seasoning, oil','Ask the recipient what they actually enjoy. Cook each item to safe temperatures and keep vegetarian options separate.']},
    'independence-day': {activities:[['Local civic history walk','Learn whose land you are on and explore multiple perspectives on local and national history.'],['Safe celebration plan','Choose a community fireworks show or low-noise alternative and plan transport and hearing protection.']],recipe:['Red-white-blue fruit skewers','Strawberries, bananas or apples, blueberries, skewers','Thread fruit onto skewers and chill. Use blunt skewers or serve deconstructed fruit for young children.']},
    'international-friendship-day': {activities:[['Friendship story exchange','Invite each person to share a memory of help or connection, with no pressure to disclose.'],['Reach-out hour','Send a voice note, letter, or call to someone you have not spoken with recently.']],recipe:['Friendship potluck board','Small dishes chosen by guests, labels, serving utensils','Invite guests to bring a meaningful snack and label allergens. Ask before sharing another person’s food story or photo.']},
    'labor-day': {activities:[['Workers’ history quiz','Use a labor museum, union history, or library source to explore local working conditions and rights.'],['Thank-you notes for workers','Recognize often-overlooked labor while avoiding photos or stories without consent.']],recipe:['End-of-summer corn and bean salad','Corn, beans, tomatoes, lime, herbs, oil','Combine cooked corn and rinsed beans with chopped vegetables and dressing. Keep chilled and credit any family recipe source.']},
    'rosh-hashanah': {activities:[['New-year reflection cards','Write hopes for the coming year and one way to repair or strengthen a relationship.'],['Apple-and-honey learning table','Learn why these foods appear in many communities’ traditions without assuming every Jewish family uses them.']],recipe:['Apples with honey or date syrup','Apple slices, honey or date syrup, optional cinnamon','Slice apples just before serving and offer date syrup as an alternative. Check community customs and dietary needs.']},
    'yom-kippur': {activities:[['Reflection and repair journal','Write privately about a lesson learned and one concrete step toward making amends.'],['Quiet-space plan','Make room for rest and respect for people fasting or attending services.']],recipe:['Gentle break-fast spread','Bagels or bread, eggs, fruit, vegetables, tea, and household favorites','Prepare simple foods ahead and label allergens. Many people fast; this is for after the fast and should not imply everyone observes identically.']},
    'halloween': {activities:[['Pumpkin design lab','Draw a design first, then decorate a pumpkin with paint or stickers as a safer carving alternative.'],['Spooky story circle','Write a short mystery with a funny or comforting ending and offer a non-scary option.']],recipe:['Pumpkin-oat snack muffins','Pumpkin puree, oats or flour, egg or substitute, cinnamon, oil','Bake using a tested muffin recipe and check doneness. Mark allergens and avoid serving raw batter.']},
    'diwali': {activities:[['Diya and light symbolism','Learn the specific meaning of light in the community or tradition being discussed; use battery lights where safer.'],['Rangoli-inspired art','Create a pattern with paper, chalk, or reusable materials and learn about regional forms.']],recipe:['Besan ladoo-inspired chickpea sweets','Roasted chickpea flour, ghee or plant fat, sugar, cardamom','Use a trusted recipe for ratios and safe cooking. This is one regional sweet idea, not a universal Diwali food.']},
    'veterans-day': {activities:[['Veteran oral-history project','Use an approved interview guide and obtain permission before recording or publishing a story.'],['Service-resource drive','Ask a local veterans’ organization which items or support it needs before collecting donations.']],recipe:['Community soup and bread','Seasonal vegetables, beans, broth, bread','Make a simple shared meal and invite participation without assuming all veterans want to discuss service.']},
    'thanksgiving': {activities:[['Gratitude and history table','Pair gratitude notes with learning from Native sources about Indigenous histories and present-day communities.'],['Food-story recipe cards','Invite guests to write the story of a dish and its source, with permission to share.']],recipe:['Roasted root vegetables','Carrots, potatoes, squash, oil, rosemary or other herbs','Cut evenly, roast until tender, and keep vegetarian and allergen-sensitive dishes separate. Menus and historical experiences vary widely.']},
    'hanukkah': {activities:[['Dreidel and story station','Learn the rules and the historical context from a Jewish educational source.'],['Eight-night kindness chain','Choose one practical act of kindness or giving for each night, if this fits your household’s observance.']],recipe:['Potato latkes','Potatoes, onion, egg or binder, oil, salt','Grate and drain potatoes, form small patties, and fry carefully in hot oil. Use a trusted recipe and label allergens.']},
    'christmas': {activities:[['Family ornament story','Make an ornament connected to a memory, place, or person and write the story on a tag.'],['Giving and light walk','Choose a local charity’s requested item or enjoy a neighborhood lights walk that is accessible to all.']],recipe:['Gingerbread cutout cookies','Flour, ginger, cinnamon, molasses, fat, sugar, egg or substitute','Chill dough, cut shapes, and bake from a tested recipe. Label allergens and note that Christmas traditions differ widely.']},
    'kwanzaa': {activities:[['Nguzo Saba reflection cards','Learn each of the seven principles from a reliable Kwanzaa resource and discuss practical examples.'],['Community heritage display','Feature books, art, music, and stories from African and African-diaspora creators with proper credit.']],recipe:['Karamu-inspired shared table','Choose dishes reflecting participants’ African, African-American, Caribbean, or other family food traditions','Invite contributors to name each dish’s origin and story. Kwanzaa tables are diverse; no one menu represents everyone.']},
    'new-years-eve': {activities:[['Year-in-review awards','Give lighthearted awards for kindness, learning, courage, or memorable moments.'],['Accessible countdown kit','Offer a quiet countdown, early countdown for children, and a no-fireworks option.']],recipe:['Midnight mocktail bar','Sparkling water, citrus, berries, herbs, ice','Set out labeled mix-ins and use separate utensils for allergens. Provide non-alcoholic options for all ages.']},
    'groundhog-day': {activities:[['Shadow science experiment','Use a flashlight and toy figure to test how light angle changes a shadow.'],['Weather folklore vs. data','Compare the tradition with actual local seasonal weather records.']],recipe:['Groundhog-shaped sandwiches','Bread, chosen filling, fruit or vegetables for decoration','Cut sandwiches with a safe cutter and decorate with produce; check allergies before serving.']},
    'mardi-gras': {activities:[['Parade color craft','Make a paper mask or reusable decoration and learn about local Mardi Gras history.'],['New Orleans music listening map','Explore jazz, brass bands, and Carnival traditions from reputable cultural sources.']],recipe:['King cake-inspired cinnamon swirl','Yeasted dough, cinnamon sugar, glaze, optional colored sugar','Bake with a tested recipe and disclose any hidden token tradition. Never put an unannounced hard object into food.']},
    'cinco-de-mayo': {activities:[['History fact-check','Learn about the Battle of Puebla and distinguish the holiday from Mexican Independence Day.'],['Local Mexican culture spotlight','Feature a Mexican or Mexican-American artist, historian, or business with permission and accurate context.']],recipe:['Pico de gallo','Tomatoes, onion, cilantro, lime, jalapeño optional, salt','Dice ingredients, mix, and chill. Adjust spice to taste and avoid treating one dish as representative of all Mexican cuisine.']},
    'pride-month': {activities:[['LGBTQ+ history timeline','Highlight local and national milestones using reputable archives and LGBTQ+ community sources.'],['Chosen-family appreciation cards','Write affirming notes and let people choose whether to share names or stories publicly.']],recipe:['Rainbow fruit platter','Fruit in a range of colors, optional yogurt dip','Arrange washed fruit in color bands, label the dip, and use separate utensils. Rainbow food is optional, not a substitute for learning about Pride.']},
    'summer-solstice': {activities:[['Sunrise or sunset journal','Record the sky and daylight with safe viewing practices; never look directly at the sun.'],['Local ecology walk','Observe plants and insects without disturbing habitats and learn about Indigenous seasonal knowledge from appropriate sources.']],recipe:['Long-day picnic wraps','Tortillas, hummus, vegetables, beans or protein, herbs','Assemble wraps shortly before eating and keep perishable fillings chilled.'],},
    'international-yoga-day': {activities:[['Accessible movement session','Offer seated, standing, and rest options led by a qualified instructor.'],['Breath and reflection journal','Try a short, comfortable breathing exercise and stop if it feels uncomfortable.']],recipe:['Cooling cucumber-yogurt bowl','Cucumber, yogurt or plant alternative, mint, lemon, salt','Grate or dice cucumber and mix with yogurt and herbs; keep chilled and label dairy.']},
    'back-to-school': {activities:[['First-week confidence cards','Write one strength, one question, and one person to ask for help.'],['Supply swap','Organize a clean, optional exchange of school supplies with clear needs and no stigma.']],recipe:['Lunchbox snack boxes','Fruit, vegetables, crackers, cheese or hummus, optional protein','Pack balanced options with cold packs as needed and account for school allergy policies.']},
    'day-of-the-dead': {activities:[['Memory altar learning project','Learn about ofrendas from Mexican sources and make a respectful display for someone remembered, if invited.'],['Marigold paper craft','Create paper marigolds and learn their symbolism without treating the observance as a costume theme.']],recipe:['Pan de muerto learning bake','Flour, yeast, eggs or substitute, sugar, butter or alternative, orange zest','Follow a tested recipe and explain the bread’s cultural context. This traditional bread has regional and family variations.']},
    'international-mens-day': {activities:[['Positive role-model profiles','Feature men who contribute through care, mentoring, creativity, and service.'],['Wellbeing conversation cards','Use respectful prompts about friendship, support, and help-seeking without stereotyping.']],recipe:['Favorite-food appreciation plate','A chosen meal or snack selected by the person being celebrated','Ask about their preference and dietary needs; there is no single dish that represents men or the observance.']},
    'world-kindness-day': {activities:[['Kindness bingo','Create squares for practical actions such as listening, thanking, including, or helping.'],['Community needs check','Ask a local nonprofit what support is useful before starting a drive.']],recipe:['Shareable fruit-and-oat bites','Oats, dried fruit, seed butter, optional chocolate chips','Mix, shape, and chill. Label allergens and package hygienically if sharing outside the household.']},
    'international-day-of-peace': {activities:[['Peace symbols research','Explore symbols of peace across cultures and the history behind each one.'],['Listening circle','Practice summarizing another person’s view respectfully without requiring agreement.']],recipe:['Shared-table vegetable couscous','Couscous, vegetables, chickpeas, herbs, lemon','Prepare according to package instructions and add vegetables and chickpeas. A shared meal can represent hospitality without implying food alone creates peace.']},
    'first-day-of-autumn': {activities:[['Leaf-shape field guide','Observe fallen leaves, identify trees using a local guide, and leave habitats undisturbed.'],['Seasonal gratitude walk','Notice changes in light, plants, and weather; adapt the route for mobility needs.']],recipe:['Apple-oat crumble','Apples, oats, flour, cinnamon, oil or butter, optional sugar','Slice apples, top with oat crumble, and bake until tender. Use a tested recipe for proportions.']},
    'first-day-of-winter': {activities:[['Winter sky watch','Observe the sunset or night sky from a safe place and learn why daylight changes.'],['Warmth and neighbor check','Prepare a cold-weather kit or check whether a neighbor needs practical support.']],recipe:['Winter vegetable soup','Root vegetables, beans, broth, herbs','Simmer chopped vegetables and beans until tender; cool and store safely. Adapt ingredients to local seasonal availability.']},
    'mothers-day-international': {activities:[['Local date and tradition check','Research the date and meaning in the country or community being featured.'],['Caregiver story exchange','Invite people to share a story about care and let them opt out or choose another person to honor.']],recipe:['A chosen family favorite','A recipe selected by the person or family being celebrated','Ask first and adapt to preferences. Dates and customs differ by country, so avoid assuming a US-style brunch is universal.']},
    'world-book-day': {activities:[['Book character scavenger hunt','Find a character who shows courage, curiosity, kindness, or persistence.'],['Community book swap','Exchange clean books with clear age labels and a no-pressure way to participate.']],recipe:['Storytime bookmarks and snack','Fruit, crackers, or another low-mess snack plus paper bookmarks','Prepare a snack that suits the group and make bookmarks with recycled paper. Avoid food near library materials.']}
  };

  const sourceLinks = [
    {label:'Washington OSPI: common religious and US public holiday calendars',url:'https://ospi.k12.wa.us/policy-funding/equity-and-civil-rights/information-families-civil-rights-washington-schools/religion-schools/common-religious-and-us-public-holiday-calendars'},
    {label:'US Office of Personnel Management: official federal holiday dates',url:'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/'},
    {label:'United Nations: headquarters holiday dates',url:'https://ask.un.org/faq?gid=181&qid=112514'},
    {label:'Washington State University: religious holiday calendar',url:'https://provost.wsu.edu/policies/religious-holidays/'}
  ];
  const verifySlugs = new Set(['lunar-new-year','ramadan','eid-al-fitr','holi','nowruz','passover','eid-al-adha','rosh-hashanah','yom-kippur','diwali','hanukkah','summer-solstice','first-day-of-autumn','first-day-of-winter','mothers-day-international']);
  const variableDate = verifySlugs.has(hub.slug);
  const thirdWeekday = (year, month, weekday, nth) => { const d = new Date(year, month, 1); return new Date(year, month, 1 + ((weekday-d.getDay()+7)%7) + (nth-1)*7); };
  const lastWeekday = (year, month, weekday) => { const d = new Date(year, month+1, 0); return new Date(year, month+1, 0 - ((d.getDay()-weekday+7)%7)); };
  const westernEaster = year => {
    const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
    return new Date(year,month-1,day);
  };
  const computedDate = (slug, year, hubDate) => {
    if (slug==='presidents-day') return thirdWeekday(year,1,1,3);
    if (slug==='memorial-day') return lastWeekday(year,4,1);
    if (slug==='labor-day') return thirdWeekday(year,8,1,1);
    if (slug==='thanksgiving') return thirdWeekday(year,10,4,4);
    if (slug==='mothers-day') return thirdWeekday(year,4,0,2);
    if (slug==='fathers-day') return thirdWeekday(year,5,0,3);
    if (slug==='easter') return westernEaster(year);
    if (slug==='mardi-gras') { const d=westernEaster(year); d.setDate(d.getDate()-47); return d; }
    const parts=String(hubDate||'').split('-').map(Number);
    if (parts.length!==3 || !parts.every(Number.isFinite)) return null;
    return new Date(year,parts[1]-1,parts[2]);
  };
  const countdown=byId('hub-countdown'), status=byId('hub-countdown-status'), note=byId('hub-countdown-note');
  function renderCountdown() {
    if (variableDate) {
      status.textContent='Local date verification required';
      byId('holiday-hub-date').textContent='Date varies · verify locally';
      note.textContent='This observance follows a lunar, religious, or astronomical calendar. The hub will not guess a definitive date; confirm with a trusted local community calendar before setting a countdown.';
      countdown.innerHTML='<div class="hub-countdown-verify" role="status">Countdown paused until the date is confirmed for your location and tradition.</div>';
      return;
    }
    const now=new Date();
    let target=computedDate(hub.slug,now.getFullYear(),hub.date);
    if (!target || Number.isNaN(target.getTime())) {
      status.textContent='Date needs review';
      countdown.innerHTML='<div class="hub-countdown-verify">A verified date rule is not available for this hub yet.</div>';
      return;
    }
    target.setHours(0,0,0,0);
    if (target<=new Date(now.getFullYear(),now.getMonth(),now.getDate())) target=computedDate(hub.slug,now.getFullYear()+1,hub.date);
    const ms=target-now, values=[[Math.floor(ms/86400000),'Days'],[Math.floor(ms%86400000/3600000),'Hours'],[Math.floor(ms%3600000/60000),'Minutes'],[Math.floor(ms%60000/1000),'Seconds']];
    countdown.innerHTML=values.map(([n,label])=>'<div><strong>'+n+'</strong><span>'+label+'</span></div>').join('');
    status.textContent='Annual date rule';
    byId('holiday-hub-date').textContent=target.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'});
    note.textContent='Estimated using the hub’s annual date rule in your browser’s local time zone. Check local listings for event times and observed dates.';
  }
  renderCountdown();
  if (!variableDate) window.setInterval(renderCountdown,1000);
  byId('hub-date-sources').innerHTML='<p class="hub-note"><strong>Date verification sources</strong> — Dates can differ by tradition, location, or sunset start. Check the source that matches the observance you follow.</p><ul>'+sourceLinks.map(s=>'<li><a href="'+s.url+'" target="_blank" rel="noopener noreferrer">'+s.label+'</a></li>').join('')+'</ul>';

  // Wikimedia Commons search returns actual uploaded photographs/illustrations.
  // Only display files with commercial-use-compatible CC BY/CC BY-SA, CC0, or public-domain licensing.
  const gallery=byId('hub-gallery');
  const imageTerms = {
    'lunar-new-year':'Lunar New Year celebration lanterns food',
    'ramadan':'Ramadan iftar table mosque lanterns',
    'eid-al-fitr':'Eid al-Fitr celebration food family',
    'eid-al-adha':'Eid al-Adha celebration community',
    'holi':'Holi festival color powder celebration',
    'nowruz':'Nowruz haft sin table',
    'passover':'Passover seder plate matzah',
    'rosh-hashanah':'Rosh Hashanah apples honey',
    'yom-kippur':'Yom Kippur synagogue prayer',
    'diwali':'Diwali diyas rangoli festival',
    'hanukkah':'Hanukkah menorah candles',
    'kwanzaa':'Kwanzaa kinara celebration',
    'juneteenth':'Juneteenth celebration community',
    'day-of-the-dead':'Dia de los Muertos ofrenda marigolds',
    'mardi-gras':'Mardi Gras parade New Orleans',
    'cinco-de-mayo':'Cinco de Mayo Puebla celebration',
    'pride-month':'Pride parade rainbow flags',
    'thanksgiving':'Thanksgiving dinner table',
    'christmas':'Christmas tree holiday lights',
    'halloween':'Halloween pumpkins costumes',
    'earth-day':'Earth Day community cleanup',
    'world-book-day':'World Book Day books library',
    'black-history-month':'Black History Month museum exhibition'
  };
  const safeLicense = short => {
    const s=String(short||'').toLowerCase().replace(/\s+/g,' ');
    return s==='cc0' || s.includes('public domain') || /^cc by(-sa)? 4\.0/.test(s) || /^cc by(-sa)? 3\.0/.test(s) || /^cc by(-sa)? 2\.5/.test(s) || /^cc by(-sa)? 2\.0/.test(s);
  };
  const stripHtml = value => { const el=document.createElement('div'); el.innerHTML=String(value||''); return (el.textContent||el.innerText||'').trim(); };
  const el=(tag,cls,text) => { const node=document.createElement(tag); if(cls)node.className=cls; if(text!==undefined)node.textContent=text; return node; };
  async function loadPhotos() {
    gallery.innerHTML='';
    const query=imageTerms[hub.slug] || (cleanName+' holiday celebration tradition');
    const statusCard=el('p','hub-gallery-status','Searching Wikimedia Commons for real photographs with reusable licenses…');
    gallery.append(statusCard);
    const api='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=18&gsrsearch='+encodeURIComponent(query+' filetype:bitmap')+'&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=760&format=json&origin=*';
    try {
      const response=await fetch(api);
      if(!response.ok) throw new Error('Commons request failed');
      const json=await response.json();
      const pages=Object.values((json.query&&json.query.pages)||{});
      const photos=pages.map(page=>{
        const info=page.imageinfo&&page.imageinfo[0], meta=info&&info.extmetadata||{};
        const license=stripHtml(meta.LicenseShortName&&meta.LicenseShortName.value);
        const fileUrl=info&&(info.thumburl||info.url);
        if(!info||!fileUrl||!fileUrl.startsWith('https://upload.wikimedia.org/')||!safeLicense(license)) return null;
        return {title:stripHtml(meta.ObjectName&&meta.ObjectName.value)||page.title.replace(/^File:/,''),creator:stripHtml(meta.Artist&&meta.Artist.value)||'Creator not listed',license,licenseUrl:meta.LicenseUrl&&meta.LicenseUrl.value,descriptionUrl:info.descriptionurl,thumb:fileUrl,original:info.url};
      }).filter(Boolean).slice(0,4);
      gallery.innerHTML='';
      if(!photos.length) {
        gallery.append(el('p','hub-gallery-status','No clearly reusable photos were found for this search. Try the Commons collection directly; no unlicensed image has been substituted.'));
        const link=el('a','text-link','Search Wikimedia Commons for '+hub.name);
        link.href='https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search='+encodeURIComponent(query);
        link.target='_blank'; link.rel='noopener noreferrer'; gallery.append(link); return;
      }
      photos.forEach(photo=>{
        const figure=el('figure','hub-photo-card');
        const link=el('a','hub-photo-link'); link.href=photo.descriptionUrl; link.target='_blank'; link.rel='noopener noreferrer'; link.setAttribute('aria-label','Open original Wikimedia Commons file: '+photo.title);
        const img=el('img','hub-photo-image'); img.src=photo.thumb; img.alt=hub.name+' photograph: '+photo.title; img.loading='lazy'; img.decoding='async'; link.append(img);
        const cap=el('figcaption','hub-photo-credit');
        cap.append(el('strong','hub-photo-title',photo.title),el('span','hub-photo-creator','By '+photo.creator));
        const licenseLink=el('a','hub-photo-license',photo.license); licenseLink.href=photo.licenseUrl||photo.descriptionUrl; licenseLink.target='_blank'; licenseLink.rel='noopener noreferrer';
        cap.append(licenseLink,el('span','hub-photo-source','Wikimedia Commons'));
        figure.append(link,cap); gallery.append(figure);
      });
    } catch (error) {
      gallery.innerHTML='';
      gallery.append(el('p','hub-gallery-status','Photo search is temporarily unavailable. No unverified image has been displayed.'));
      const link=el('a','text-link','Open Wikimedia Commons search');
      link.href='https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search='+encodeURIComponent(query);
      link.target='_blank'; link.rel='noopener noreferrer'; gallery.append(link);
    }
  }
  loadPhotos();

  const fallback = {activities:[['Tradition discovery','Learn about this observance from a trusted cultural, historical, or community source.'],['Make a personal keepsake','Create a card, journal page, or small craft that reflects what this day means to your household.']],recipe:['A family-selected dish','Choose ingredients familiar to the people gathering','Use a trusted tested recipe, check allergies, and credit the cultural or family source when known.']};
  const specific=content[hub.slug]||fallback;
  byId('hub-activity-pack').innerHTML=specific.activities.map((item,i)=>'<article class="hub-activity-card"><span class="hub-activity-number">0'+(i+1)+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p><label class="hub-check"><input type="checkbox"> Completed</label></article>').join('');
  byId('hub-print-activities').addEventListener('click',()=>window.print());
  const recipe=specific.recipe;
  byId('hub-recipes').innerHTML='<article class="hub-recipe-card"><div class="hub-recipe-top"><span>HOLIDAY RECIPE IDEA</span><span>Adapt to taste</span></div><h3>'+recipe[0]+'</h3><p><b>Ingredients</b><br>'+recipe[1]+'</p><p><b>Method & context</b><br>'+recipe[2]+'</p><p class="hub-recipe-disclaimer">This is inspiration, not a tested nutritional or food-safety specification. Use a trusted tested recipe for exact quantities, temperatures, and cooking times.</p><button type="button" class="text-link hub-print-recipe">Print this idea ↗</button></article>';
  byId('hub-recipes').querySelector('.hub-print-recipe').addEventListener('click',()=>{byId('hub-recipes').classList.add('print-focus');window.print();byId('hub-recipes').classList.remove('print-focus');});
  const media = [
    {title:'Music and performances',text:'Search for official recordings, traditional music, and community artists.',term:'official music performance'},
    {title:'History and traditions',text:'Prioritize museums, cultural organizations, and community-led explainers.',term:'history traditions official video'},
    {title:'Family-friendly watchlist',text:'Check ratings, accessibility, and sharing rights before public screenings.',term:'family friendly official video'}
  ];
  byId('hub-media-collections').innerHTML=media.map(item=>'<article class="hub-media-card"><span aria-hidden="true">▶</span><h3>'+item.title+'</h3><p>'+item.text+'</p><a href="'+searchUrl(item.term)+'" target="_blank" rel="noopener noreferrer">Explore collection ↗</a></article>').join('');
  byId('hub-events-title').textContent='Find '+hub.name+' events';
  byId('hub-events-description').textContent='Search for '+hub.name+' events, workshops, family activities, cultural programs, and community gatherings.';
  byId('hub-events-link').href=searchUrl('events near me');
  byId('hub-events-link').setAttribute('aria-label','Search the web for '+hub.name+' events near me');
})();