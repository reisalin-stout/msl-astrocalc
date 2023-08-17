document.addEventListener("subpage-load", function(event){
  if (event.detail.page == "ehp"){
    //pass
  }
});

document.addEventListener("new-calc", function(event){
  if (event.detail.page == "ehp"){
    updateEHP();
  }
});

var monster = {
  "baseHP" : 0,
  "bonusHP" : 0,
  "baseDef" :0,
  "bonusDef" : 0,
  "leadTypeD" : "Other",
  "leadValueD" : 0
}

function updateEHP(){
  monster.baseHP = document.getElementById("base-hp").valueAsNumber || 0;
  monster.bonusHP = document.getElementById("bonus-hp").valueAsNumber || 0;
  monster.baseDef = document.getElementById("base-def").valueAsNumber || 0;
  monster.bonusDef = document.getElementById("bonus-def").valueAsNumber || 0;
  
  monster.leadTypeD = document.getElementById("lead-type-d").value;
  monster.leadValueD = document.getElementById("lead-value-d").valueAsNumber || 0;
  
  generateEHP()

}

function generateEHP(){

  var totalHP = (monster.baseHP * (1.0 + (monster.leadTypeD === "hp" ? monster.leadValueD : 0)/100)) + monster.bonusHP;
  
  var totalDef = (monster.baseDef * (1.0 + (monster.leadTypeD === "def" ? monster.leadValueD : 0)/100)) + monster.bonusDef;
  
  var result = totalHP / (1- (totalDef / (totalDef + 1200)));
  document.getElementById("result-ehp").innerHTML = result;

}



