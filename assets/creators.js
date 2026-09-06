/* =========================================================
   CROWRULES CREATORS HUB v1.0
   Shared JavaScript
   ========================================================= */

"use strict";


/* ---------------------------------------------------------
   Sidebar
--------------------------------------------------------- */

function toggleSidebar(){

    const sidebar =
        document.getElementById("sidebar");

    if(!sidebar) return;

    sidebar.classList.toggle("open");

}


/* ---------------------------------------------------------
   Toast
--------------------------------------------------------- */

function toast(message){

    const existing =
        document.querySelector(".toast");

    if(existing){
        existing.remove();
    }

    const element =
        document.createElement("div");

    element.className = "toast";

    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(() => {

        element.remove();

    }, 2600);

}


/* ---------------------------------------------------------
   Creator Search
--------------------------------------------------------- */

function filterCreators(){

    const input =
        document.getElementById("creatorSearch");

    if(!input) return;

    const query =
        input.value.toLowerCase().trim();

    const creators =
        document.querySelectorAll(".creator-card");

    creators.forEach(card => {

        const searchText =
            (card.dataset.search || card.textContent)
            .toLowerCase();

        card.style.display =
            searchText.includes(query)
                ? ""
                : "none";

    });

}


/* ---------------------------------------------------------
   Follow Creator
--------------------------------------------------------- */

function followCreator(button){

    if(!button) return;

    const following =
        button.dataset.following === "true";

    if(following){

        button.dataset.following = "false";

        button.textContent =
            "Follow Creator";

        toast("Creator unfollowed");

    }else{

        button.dataset.following = "true";

        button.textContent =
            "Following ✓";

        toast("Now following creator");

    }

}


/* ---------------------------------------------------------
   Creator Application
--------------------------------------------------------- */

function submitCreatorApplication(event){

    event.preventDefault();

    const name =
        document.getElementById("displayName")?.value;

    const handle =
        document.getElementById("creatorHandle")?.value;

    if(!name || !handle){

        toast("Please complete the required fields");

        return;

    }

    /*
      SUPABASE CONNECTION POINT

      Future implementation:

      supabase
        .from("creator_applications")
        .insert({
            display_name: name,
            handle: handle,
            ...
        });
    */

    toast(
        "Application prepared — Supabase submission comes next."
    );

}


/* ---------------------------------------------------------
   Upload Handler
--------------------------------------------------------- */

function handleUpload(event){

    event.preventDefault();

    const file =
        event.target.querySelector(
            'input[type="file"]'
        );

    if(file && file.files.length === 0){

        toast("Please select a media file.");

        return;

    }

    /*
      SUPABASE STORAGE CONNECTION POINT

      Future implementation:

      const path =
        `creators/${user.id}/${file.name}`;

      supabase.storage
        .from("creator-media")
        .upload(path, file);
    */

    toast(
        "Upload prepared — connect Supabase Storage next."
    );

}


/* ---------------------------------------------------------
   Settings
--------------------------------------------------------- */

function saveSettings(event){

    event.preventDefault();

    /*
      SUPABASE CONNECTION POINT

      Future implementation:

      supabase
        .from("creator_profiles")
        .update(profileData)
        .eq("user_id", user.id);
    */

    toast("Creator settings saved locally.");

}


/* ---------------------------------------------------------
   Filter Buttons
--------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event){

        const filter =
            event.target.closest(".filter");

        if(!filter) return;

        const group =
            filter.parentElement;

        group
            .querySelectorAll(".filter")
            .forEach(button => {

                button.classList.remove("active");

            });

        filter.classList.add("active");

        toast(
            "Filter: " +
            filter.textContent.trim()
        );

    }
);


/* ---------------------------------------------------------
   Close Mobile Sidebar
--------------------------------------------------------- */

document.addEventListener(
    "click",
    function(event){

        const sidebar =
            document.getElementById("sidebar");

        if(!sidebar) return;

        const menu =
            event.target.closest(".menu-btn");

        if(
            window.innerWidth <= 850 &&
            !sidebar.contains(event.target) &&
            !menu
        ){

            sidebar.classList.remove("open");

        }

    }
);


/* ---------------------------------------------------------
   Initialization
--------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
            "CrowRules Creators Hub v1.0 loaded."
        );

        /*
          FUTURE SUPABASE INITIALIZATION:

          const SUPABASE_URL = "...";
          const SUPABASE_ANON_KEY = "...";

          const supabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );
        */

    }
);