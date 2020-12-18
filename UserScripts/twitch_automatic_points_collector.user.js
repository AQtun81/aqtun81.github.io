// ==UserScript==
// @name         Twitch Automatic Points Collector
// @namespace    https://www.twitch.tv
// @version      1.1
// @description  Read Title :)
// @author       AQtun81

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
  element = document.querySelector('span.tw-button__text[data-a-target="tw-core-button-label-text"]');
  if (element != null) {
    var evObj = document.createEvent('Events');
    evObj.initEvent('click', true, false);
    element.dispatchEvent(evObj);
  }
};

(function() {
    'use strict';
    setInterval(getPoints, 5000);
})();
