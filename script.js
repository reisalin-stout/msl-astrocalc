const parser = new DOMParser();
const pages = {
  "home" : {
    "nav" : "nav-home",
    "name" : "Home",
    "url" : "home.html"
  },
  "calculator" : {
    "nav" : "nav-calculator",
    "name" : "Calculator",
    "url" : "calculator.html"
  },
  "events" : {
    "nav" : "nav-events",
    "name" : "Events",
    "url" : "events.html"
  },
  "about" : {
    "nav" : "nav-about",
    "name" : "About",
    "url" : "about.html"
  }
}

async function getContent(target, callback){
  fetch("pages/"+pages[target].url)
  .then((response) => response.text())
  .then((html) => {
    var doc = parser.parseFromString(html, "text/html");
    callback(doc.getElementById("export").innerHTML);
    document.dispatchEvent(new CustomEvent("subpage-load", {
      detail : target
    }))
  })
  .catch(err => callback("error: [" + err + "]<br>Please contact me on Discord at .reisalin."))
}

function updateNavbar() {

  for(const node of navbar.childNodes) {
    node.classList?.remove("active")
  } 
  document.getElementById("nav-"+currentPage()).classList.add("active")
}

function loadContent(){
  updateNavbar();
  getContent(currentPage(), function (body) {
      content.innerHTML = body;
  });
}

function createNavbar() {
  for(const [ key, value ] of Object.entries(pages)) {
    navbar.innerHTML += `<a class="nav${(key==currentPage())? ' active' : ''}" id="${value.nav}" href="#${key}">${value.name}</a>`
  }
}

function currentPage() {
  return location.hash.substring(1);
}

//Main function
function main() {
  if(!location.hash) {
    location.hash = "#home";
  }
  createNavbar();  
  loadContent();
  window.addEventListener("hashchange", loadContent)
}

//Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  navbar = document.getElementById('navbar');
  content = document.getElementById('content');
  main();
  
});
