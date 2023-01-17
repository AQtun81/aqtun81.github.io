// ==UserScript==
// @name         Twitch Automatic Points Collector
// @namespace    https://www.twitch.tv
// @version      1.3
// @description  Read Title :)
// @author       AQtun81

// @history      1.3 updated css query to work on current site
// @history      1.2 updated css query to work on current site
// @history      1.1 updated css query to work on current site
// @history      1.0 initial release

// @include		http://twitch.tv/*
// @include		https://twitch.tv/*
// @include		http://*.twitch.tv/*
// @include		https://*.twitch.tv/*
//
// @exclude		http://api.twitch.tv/*
// @exclude		https://api.twitch.tv/*

// @grant        none

// ==/UserScript==

window.getPoints = function() {
  var element = document.querySelector('[aria-label="Claim Bonus"] > div');
  if (element != null) {
    var evObj = document.createEvent('Events');
    evObj.initEvent('click', true, false);
    element.dispatchEvent(evObj);
    console.log('%c[Points Collector]' + '%c Collecting Points', 'background: #222; color: #32a869', '');
  }
};

(function() {
    'use strict';
    setInterval(getPoints, 1000);
})();
