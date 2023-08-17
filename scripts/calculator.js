const calcParser = new DOMParser();

var astromonDB;
var astromon;

var upgrades = {
  superawakening: false,
  variant: false,
  skillbook : {
    passive: false,
    active: false
  },
  equips: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {}
  },
  enhancements: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {}
  }

}

// -------------------------------------------------- Event Listeners --------------------------------------------------
document.addEventListener("subpage-load", function (event) {
  if (event.detail == "calculator") {
    firstLoad();
    document.getElementById('portrait').addEventListener('click', function (event) {
      document.getElementById("list-container").classList.toggle("hidden");
      document.getElementById("list-search-input").focus();
    });

    document.addEventListener("astromon-selection", function(event) {
      document.getElementById("list-container").classList.add("hidden");
      document.getElementById("list-search-input").value = "";
      resetFilters();
      document.getElementById("list-search-input").blur()
      document.dispatchEvent(new CustomEvent("update-stats"))
    })
    
    document.addEventListener("update-stats", function(event) {
      loadStats();
    })
    
    document.onkeydown = function(evt) {
      if (evt.key == "Escape" || evt.key == "Esc") {
        document.dispatchEvent(new CustomEvent("astromon-selection"))
      }
    };
  }
});

document.addEventListener("input", function (event) {
  if (event.target.id == "lead-type" || event.target.id == "lead-value") {
    updateLead(
      document.getElementById("lead-type").value,
      document.getElementById("lead-value").valueAsNumber
    );
    return;
  }
    if (event.target.name == "base-stat") {
     astromonDB.stats.base[event.target.id] = event.target.valueAsNumber;
      updateStats()
    }
  
  if (event.target.id == "form") {
    tempEquip.data.form = event.target.value;
    return;
  }
  if (event.target.id == "type") {
    tempEquip.data.type = event.target.value;
    return;
  }
  if (event.target.id == "exclusive") {
    setExclusive(event.target.checked)
    return;
  }  
  if (event.target.name == "update-substat") {
    changeStat(event.target.parentElement.parentElement.id);
    return;
  }

/*
  if (event.target.id == "exclusive") {
    changeTrinketsFixedStats(event.target.checked);
    return;
  }
  */
});


// -------------------------------------------------- List Selection Functions --------------------------------------------------
function loadFromList(object) {
  document.getElementById("portrait-base").classList.add("unrendered")
  document.getElementById("portrait-avatar").src = `images/icons/${object.icon}`
  document.getElementById("portrait-avatar").classList.remove("unrendered")
  document.getElementById("portrait-evo").src = `images/items/portrait-evo-${object.evolution}.png`
  document.getElementById("portrait-evo").classList.remove("unrendered")
  document.getElementById("portrait-element").src = `images/items/portrait-element-${object.element}.png`
  document.getElementById("portrait-element").classList.remove("unrendered")
  document.getElementById("portrait-awakening").classList.remove("unrendered")
  document.getElementById("portrait-level").classList.remove("unrendered")
 
  astromon = object;
  document.dispatchEvent(new CustomEvent("astromon-selection"));
}

function loopAstromon(callback){
  for (const slug of Object.values(astromonDB.data)){
    for (const element of Object.values(slug)) {
      for (const evolution of Object.values(element)){
        callback(evolution)
        }
      }
    }
    return
  }

function createListIcon(data){
  var element = document.createElement("div");
  element.classList.add("icon-stack")
  element.innerHTML = 
  `<img class="list-icon empty" src="images/items/portrait-empty.png"/>
  <img class="list-icon avatar" src="images/icons/${data.icon}"/>
  <img class="list-icon evo" src="images/items/portrait-evo-${data.evolution}.png"/>
  <img class="list-icon element" src="images/items/portrait-element-${data.element}.png"/>
  <img class="list-icon stars" src="images/items/portrait-awakening.png"/>
  <img class="list-icon level" src="images/items/portrait-level.png"/>`
  element.classList.add(data.slug, data.element, data.name.replaceAll(" ", ""), data.evolution, data.type)
  element.onclick = function() { loadFromList(data) } ;
  return element;
}



// Filters
function filterFunction() {
  var filter, filters, a, truth;
  filter = document.getElementById("list-search-input").value.toLowerCase();
  filters = filter.split(/[ ,]+/);

  var elements = document.getElementsByClassName("icon-stack");
  for(var e of elements) {
    truth = true;
    for (a of filters) {
      truth = truth&& e.classList.toString().toLowerCase().substring(("icon-stack").length).includes(a)
    }
    if(truth) {
      e.style.display = ""; 
    } else {
      e.style.display = "none"; 
    }
  }
}

function resetFilters(){
  var elements = document.getElementsByClassName("icon-stack");
  for(var e of elements) {
    e.style.display = ""; 
  }
}

// ----------------------------------------------------- Startup Functions -----------------------------------------------------

async function firstLoad() {
  await importAstromon();
  makeAstromonList();
  updateStats();

  /*
  if (localStorage.getItem("astrocalc-recent-calculation")) {
    console.log(
      localStorage.getItem("astrocalc-recent-calculation").toString()
    );
  } else {
    localStorage.setItem("astrocalc-recent-calculation", astromon);
  }*/
  
}

async function importAstromon() {
  await fetch("../data/astromon-db.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    astromonDB = data;
    return
    });
}

function makeAstromonList(){
  loopAstromon((object) => {
      document.getElementById("list-wrapper").appendChild(createListIcon(object));
  })
}

function loadStats() {
  document.getElementById("base-hp").innerHTML = astromon.stats.hp;
  document.getElementById("base-atk").innerHTML = astromon.stats.atk;
  document.getElementById("base-def").innerHTML = astromon.stats.def;
  document.getElementById("base-rec").innerHTML = astromon.stats.rec;
  document.getElementById("base-cd").innerHTML = astromon.stats.cd;
  document.getElementById("base-cr").innerHTML = astromon.stats.cr;
  document.getElementById("base-res").innerHTML = astromon.stats.res;
  document.getElementById("base-cre").innerHTML = astromon.stats.cre;
 
  document.getElementById("detail-rank").innerHTML = (astromon.name.search(">") != -1) ? ("&lt;" + astromon.name.substring(1, astromon.name.search(">")) + "&gt;") : "";
  document.getElementById("detail-name").innerHTML = (astromon.name.search(">") != -1) ? astromon.name.substring(astromon.name.search(">")+2) : astromon.name;
  document.getElementById("detail-type").innerHTML = astromon.type;

}



/*
function updateCalc() {
  astromon.HP = document.getElementById("base-hp").valueAsNumber || 0;
  astromon.ATK = document.getElementById("base-atk").valueAsNumber || 0;
  astromon.DEF = document.getElementById("base-def").valueAsNumber || 0;
  astromon.REC = document.getElementById("base-rec").valueAsNumber || 0;
  astromon.CD = document.getElementById("base-cd").valueAsNumber || 0;
  astromon.CR = document.getElementById("base-cr").valueAsNumber || 0;
  astromon.RES = document.getElementById("base-res").valueAsNumber || 0;
  astromon.CRE = document.getElementById("base-cre").valueAsNumber || 0;

  monster.baseStat = document.getElementById("base-attack").valueAsNumber || 0;
  monster.bonusStat =
    document.getElementById("bonus-attack").valueAsNumber || 0;
  monster.baseCD = document.getElementById("base-cd").valueAsNumber || 0;
  monster.bonusCD = document.getElementById("bonus-cd").valueAsNumber || 0;

  monster.leadType = document.getElementById("lead-type").value;
  monster.leadValue = document.getElementById("lead-value").valueAsNumber || 0;
  monster.skillType = document.getElementById("skill-type").value;
  monster.skillValue =
    document.getElementById("skill-value").valueAsNumber || 0;

  monster.skillbook = document.getElementById("skillbook").valueAsNumber || 0;
  monster.advantage = document.getElementById("advantage").checked;

  generatedamage();
}

function generatedamage() {
  var totalATK =
    monster.baseStat *
      (1.0 + (monster.leadType == "atk" ? monster.leadValue : 0) / 100) +
    monster.bonusStat;
  var hardModifier =
    5.5 -
    (monster.skillType == "agg-hp" ? 5.2 : 0) -
    (monster.skillType == "agg-def" ? 1.5 : 0);
  var totalCD =
    (100 + monster.baseCD) *
      (1.0 + (monster.skillType == "hunter" ? monster.skillValue : 0) / 100) +
    monster.bonusCD +
    (monster.leadType == "cd" ? monster.leadValue : 0);
  var elementBonus =
    1 +
    (monster.advantage ? 0.5 : 0) +
    (monster.skillType == "predator" ? monster.skillValue : 0) / 100;
  var skillbook = 1 + monster.skillbook / 100;

  var result = totalATK * elementBonus * skillbook * hardModifier;
  document.getElementById("result-dmg").innerHTML = result;

  var critical =
    ((totalATK * totalCD) / 100) * elementBonus * skillbook * hardModifier;
  document.getElementById("critical-dmg").innerHTML = critical;
}
*/
// ------------------------------------------------------------ Team Management ------------------------------------------------------------
/*
function updateLead(type, value) {
  astromon.leadType = type;
  astromon.leadValue = value;
  updatePStats();
}
*/

// ------------------------------------------------------------- Data Retrieval ------------------------------------------------------------

function updateStats() {
  Object.keys(astromonDB.stats.bonus).forEach((stat) => {
    var value = 0;
    
    //Get Stats from Equips
    astromonDB.equips.forEach((equip) => {
      equip.types.forEach((text, index) => {
        if(text == stat){
          value += equip.values[index];
        }
      })
    })

    astromonDB.stats.bonus[stat] = value;

})
  updateTotals()
}

function updateTotals(){
  astromonDB.stats.total["tHP"] = astromonDB.stats.base["HP"] + (astromonDB.stats.base["HP"] * astromonDB.stats.bonus["pHP"] / 100) + astromonDB.stats.bonus["fHP"];
  document.getElementById("bonus-HP").innerHTML =  "+" + (astromonDB.stats.bonus["fHP"] + (astromonDB.stats.base["HP"] * astromonDB.stats.bonus["pHP"] / 100));
  
  astromonDB.stats.total["tATK"] = astromonDB.stats.base["ATK"] + (astromonDB.stats.base["ATK"] * astromonDB.stats.bonus["pATK"] / 100) + astromonDB.stats.bonus["fATK"];
  document.getElementById("bonus-ATK").innerHTML =  "+" + (astromonDB.stats.bonus["fATK"] + (astromonDB.stats.base["ATK"] * astromonDB.stats.bonus["pATK"] / 100));
  
  astromonDB.stats.total["tDEF"] = astromonDB.stats.base["DEF"] + (astromonDB.stats.base["DEF"] * astromonDB.stats.bonus["pDEF"] / 100) + astromonDB.stats.bonus["fDEF"];
  document.getElementById("bonus-DEF").innerHTML =  "+" + (astromonDB.stats.bonus["fDEF"] + (astromonDB.stats.base["DEF"] * astromonDB.stats.bonus["pDEF"] / 100));
  
  astromonDB.stats.total["tREC"] = astromonDB.stats.base["REC"] + (astromonDB.stats.base["REC"] * astromonDB.stats.bonus["pREC"] / 100) + astromonDB.stats.bonus["fREC"];
  document.getElementById("bonus-REC").innerHTML =  "+" + (astromonDB.stats.bonus["fREC"] + (astromonDB.stats.base["REC"] * astromonDB.stats.bonus["pREC"] / 100));
  
  astromonDB.stats.total["tCD"] = astromonDB.stats.base["CD"] + astromonDB.stats.bonus["bCD"];
  document.getElementById("bonus-CD").innerHTML =  "+" + astromonDB.stats.bonus["bCD"] + "%";  
  
  astromonDB.stats.total["tCR"] = astromonDB.stats.base["CR"] + astromonDB.stats.bonus["bCR"];
  document.getElementById("bonus-CR").innerHTML =  "+" + astromonDB.stats.bonus["bCR"] + "%";   
  
  astromonDB.stats.total["tRES"] = astromonDB.stats.base["RES"] + astromonDB.stats.bonus["bRES"];
  document.getElementById("bonus-RES").innerHTML =  "+" + astromonDB.stats.bonus["bRES"] + "%";  
  
  astromonDB.stats.total["tCRE"] = astromonDB.stats.base["CRE"] + astromonDB.stats.bonus["bCRE"];
  document.getElementById("bonus-CRE").innerHTML =  "+" + astromonDB.stats.bonus["bCRE"] + "%";  
  
  
}

// ---------------------------------------------------------- Equipment Management ---------------------------------------------------------

var tempEquip = {
  slot : 0,
  data : {}
};

async function openSlot(type, slot) {
            backupEquip(slot)
            setOptions()
            refreshEquip();
    document.getElementById("equip-detail").classList.remove("collapsed");
};

async function closeSlot(){
  document.getElementById("equip-detail").classList.add("collapsed");
}


function changeStat(row) {
  var placeholder = {
    "main" : 0,
    "sub1" : 1,
    "sub2" : 2,
    "sub3" : 3,
    "sub4" : 4
  };
  
  astromonDB.equips[tempEquip.slot].types[placeholder[row]] = document.getElementById(row+"-select").value;
  astromonDB.equips[tempEquip.slot].values[placeholder[row]] = document.getElementById(row+"-value").valueAsNumber;  

  refreshEquip()
  updateStats()
}

function setExclusive(value){
  astromonDB.equips[tempEquip.slot].exclusive = value;
  if(astromonDB.equips[tempEquip.slot].form == "magicite"){
    astromonDB.equips[tempEquip.slot].types[3] = ((value) ? 'fDEF' : 'fREC')
  };
  if(astromonDB.equips[tempEquip.slot].form == "relic"){
    astromonDB.equips[tempEquip.slot].types[2] = ((value) ? 'fATK' : 'fREC')
  };
  refreshEquip();
}

function setOptions(){
  
  if(astromonDB.equips[tempEquip.slot]["class"] == "gem"){
    document.getElementById("form").classList.remove("collapsed");
    document.getElementById("colour").classList.remove("collapsed");   
    document.getElementById("sub4").classList.remove("collapsed");

    document.getElementById("excl").classList.add("collapsed");
    
    document.getElementById("main-value").setAttribute('readonly', true);

    
    document.getElementById("main-select").disabled = false;
    document.getElementById("sub1-select").disabled = false;
    document.getElementById("sub2-select").disabled = false;
    document.getElementById("sub3-select").disabled = false;
    document.getElementById("sub4-select").disabled = false;
      
  }
  if(astromonDB.equips[tempEquip.slot]["class"] == "trinket"){
    document.getElementById("form").classList.add("collapsed");
    document.getElementById("colour").classList.add("collapsed");   
    document.getElementById("sub4").classList.add("collapsed");
    
    document.getElementById("main-select").disabled = true;
    document.getElementById("sub1-select").disabled = true;
    document.getElementById("sub2-select").disabled = true;
    document.getElementById("sub3-select").disabled = true;
    document.getElementById("sub4-select").disabled = true;
    
    document.getElementById("main-value").removeAttribute('readonly');
    
    document.getElementById("excl").classList.remove("collapsed");
  }  
}

function refreshEquip(){
  document.getElementById("main-select").value = astromonDB.equips[tempEquip.slot].types[0] || "void";
  
  if(astromonDB.equips[tempEquip.slot].class == "gem"){
    document.getElementById("main-value").valueAsNumber = returnMaxVal(astromonDB.equips[tempEquip.slot].types[0]) || 0;
    astromonDB.equips[tempEquip.slot].values[0] = returnMaxVal(astromonDB.equips[tempEquip.slot].types[0]);
  } else {
    document.getElementById("main-value").valueAsNumber = astromonDB.equips[tempEquip.slot].values[0] || 0;    
  }
    
  document.getElementById("sub1-select").value = astromonDB.equips[tempEquip.slot].types[1] || "void";
  document.getElementById("sub1-value").valueAsNumber = astromonDB.equips[tempEquip.slot].values[1] || 0;
  document.getElementById("sub2-select").value = astromonDB.equips[tempEquip.slot].types[2] || "void";
  document.getElementById("sub2-value").valueAsNumber = astromonDB.equips[tempEquip.slot].values[2] || 0;
  document.getElementById("sub3-select").value = astromonDB.equips[tempEquip.slot].types[3] || "void";
  document.getElementById("sub3-value").valueAsNumber = astromonDB.equips[tempEquip.slot].values[3] || 0;
  document.getElementById("sub4-select").value = astromonDB.equips[tempEquip.slot].types[4] || "void";
  document.getElementById("sub4-value").valueAsNumber = astromonDB.equips[tempEquip.slot].values[4] || 0;
  
  if(astromonDB.equips[tempEquip.slot].class == "trinket"){
    document.getElementById("exclusive").checked = astromonDB.equips[tempEquip.slot].exclusive;
  }
  
  
}

function backupEquip(slot){
    tempEquip.slot = slot
    tempEquip.data = JSON.parse(JSON.stringify(astromonDB.equips[slot]));
}

function restoreEquip(){
    astromonDB.equips[tempEquip.slot] = JSON.parse(JSON.stringify(tempEquip.data));
}

// -------------------------------------------------------------- Default Data -------------------------------------------------------------
function returnMaxVal(stat) {
var defaults = {
  "pHP" : 68,
  "pATK" : 68,
  "pDEF" : 68,
  "pREC" : 68,
  "fHP" : 12400,
  "fATK" : 715,
  "fDEF" : 715,
  "fREC" : 715,
  "bCD" : 70,
  "bCR" : 54,
  "bRES" : 61
}  
  return defaults[stat]
}

// ------------------------------------------------------------ Event Management -----------------------------------------------------------

