// ==UserScript==
// @name         Twitch Automatic Points Collector
// @namespace    https://www.twitch.tv
// @version      1.0
// @description  Read Title :)
// @author       AQtun81

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
  element = document.querySelector(".tw-button.tw-button--success.tw-interactive");
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
