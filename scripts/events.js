document.addEventListener("subpage-load", function (event) {
  if (event.detail.page == "events") {
    //pass
  }
});

document.addEventListener("event-load", function (event) {
  setup(event.detail.page);
});

// New Code to test
var currentView = "";
var monthsList = {};
var dataList = {};

async function setup(event) {
  if (currentView == event) {
    return;
  }
  currentView = event;
  if (!document.getElementById("primo-table")) {
    //pass
  } else {
    document.getElementById("primo-table").remove();
  }
  await fetchData(event);
  generateTable();
}

async function fetchData(page) {
  await fetch("../data/months.json")
    .then((response) => {
      return response.json();
    })
    .then((months) => {
      monthsList = months;
      return;
    });
  await fetch("../data/" + page + ".json")
    .then((response) => {
      return response.json();
    })
    .then((list) => {
      dataList = list;
      return;
    });
}

async function generateTable() {
  var repeats = {};

  var table = document.createElement("table");
  table.id = "primo-table";
  table.classList.add("primo-table");
  document
    .getElementById("content")
    .insertBefore(table, document.getElementById("event-legend"));

  var tbody = table.createTBody();

  monthsList.data.forEach((month, index) => {
    tbody.insertRow(index).insertCell(0);
    tbody.rows[index].cells[0].id,
      (tbody.rows[index].cells[0].innerHTML = month);
  });

  Object.keys(dataList).forEach((year, column) => {
    if (year == "thanks") {
      document.getElementById("thanks").innerHTML = dataList["thanks"];
      return;
    }
    tbody.rows[0].insertCell(column + 1).innerHTML = year;

    Object.keys(dataList[year]).forEach((month, row) => {
      tbody.rows[row + 1].insertCell(column + 1).innerHTML =
        dataList[year][month].astromon + " " +dataList[year][month].status;
      if (dataList[year][month].astromon in repeats) {
        repeats[dataList[year][month].astromon]++;
      } else {
        repeats[dataList[year][month].astromon] = 1;
      }
      if (
        dataList[year][month].astromon == "---" ||
        dataList[year][month].astromon == ""
      ) {
        repeats[dataList[year][month].astromon] = 1;
      }
      tbody.rows[row + 1].cells[column + 1].classList.add(
        "primo-" + repeats[dataList[year][month].astromon]
      );
    });
  });
  return true;
}
