document.addEventListener("subpage-load", function(event){
  if (event.detail.page == "calc"){
    //pass
  }
});

document.addEventListener("new-calc", function(event){
  if (event.detail.page == "calc"){
    updateCalc();
  }
});

var monster = {
  "baseStat" : 0,
  "bonusStat" : 0,
  "baseCD" :0,
  "bonusCD" : 0,
  "leadType" : "Other",
  "leadValue" : 0,
  "skillType" : "Other",
  "skillValue" : 0,
  "skillbook" : 0,
  "advantage" : false
}

function updateCalc(){
  monster.baseStat = document.getElementById("base-attack").valueAsNumber || 0;
  monster.bonusStat = document.getElementById("bonus-attack").valueAsNumber || 0;
  monster.baseCD = document.getElementById("base-cd").valueAsNumber || 0;
  monster.bonusCD = document.getElementById("bonus-cd").valueAsNumber || 0;
  
  monster.leadType = document.getElementById("lead-type").value;
  monster.leadValue = document.getElementById("lead-value").valueAsNumber || 0;
  monster.skillType = document.getElementById("skill-type").value;
  monster.skillValue = document.getElementById("skill-value").valueAsNumber || 0;
  
  monster.skillbook = document.getElementById("skillbook").valueAsNumber || 0;
  monster.advantage = document.getElementById("advantage").checked;  
  
  generatedamage()

}

function generatedamage(){

  var totalATK = (monster.baseStat * (1.0 + ((monster.leadType == "atk") ? monster.leadValue : 0)/100)) + monster.bonusStat;
  var hardModifier = 5.5 - ((monster.skillType == "agg-hp") ? 5.2 : 0) - ((monster.skillType == "agg-def") ? 1.5 : 0);
  var totalCD = ((100+monster.baseCD) * (1.0 + ((monster.skillType == "hunter") ? monster.skillValue : 0)/100)) + monster.bonusCD + ((monster.leadType == "cd") ? monster.leadValue : 0);
  var elementBonus = 1+(monster.advantage ? 0.5 : 0)+(((monster.skillType == "predator") ? monster.skillValue : 0)/100);
  var skillbook = 1 + (monster.skillbook/100);
  
  var result = totalATK * elementBonus * skillbook * hardModifier
  document.getElementById("result-dmg").innerHTML = result;

  
  var critical = totalATK * totalCD/100 * elementBonus * skillbook * hardModifier;
  document.getElementById("critical-dmg").innerHTML = critical;
}
