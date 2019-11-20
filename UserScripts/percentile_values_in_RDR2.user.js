// ==UserScript==
// @name         Percentile values in RDR2 catalogue
// @namespace    https://socialclub.rockstargames.com/
// @version      1.0
// @description  Displays percentile values in RDR2 catalogue based on bars
// @author       AQtun81
// @match        https://socialclub.rockstargames.com/games/rdr2/catalogue/*
// @grant        none
// ==/UserScript==

window.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

window.displayPercentileValuesLoop = async function() {
  while (true) {
    await sleep(500);
    var stats = document.getElementsByClassName('ProductStats__fill__3c0ZP');
    var rows = document.querySelectorAll('.ProductStats__row__UwQnZ .ProductStats__cell__1h1Mi:first-child');
    if (stats.length == 0 || rows.length == 0) continue;
    if (rows[0].innerText.substr(-1) != "%") {
      displayPercentileValues(rows, stats);
    }
  }
};

window.displayPercentileValues = function(rows, stats) {
  for (var i = 0; i < rows.length; i++) {
    rows[i].innerText = rows[i].innerText + " " + stats[i].attributes.width.value;
  }
};

(function() {
    'use strict';
    displayPercentileValuesLoop();
})();
