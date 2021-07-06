// ==UserScript==
// @name         Twitch Automatic ADs muter
// @namespace    https://www.twitch.tv
// @version      1.0
// @description  Read Title :)
// @author       AQtun81

// @history      1.0 initial release

// @include		http://twitch.tv/*
// @include		https://twitch.tv/*
// @include		http://*.twitch.tv/*
// @include		https://*.twitch.tv/*
//
// @exclude		http://api.twitch.tv/*
// @exclude		https://api.twitch.tv/*

// @icon         https://www.google.com/s2/favicons?domain=twitch.tv

// @grant        none

// ==/UserScript==

window.muteAD = function() {
  element = document.querySelector("div.tw-c-background-overlay:nth-child(4)");
  if (element != null && !isMuted) {
      userVolume = document.querySelector(".video-player__container > video").volume; // store current volume
      isMuted = true;
      document.querySelector(".video-player__container > video").volume = 0; // mute stream
      //console.log("AD is playing! attempting to mute");
  } else if (element == null && isMuted) {
      document.querySelector(".video-player__container > video").volume = userVolume; // resume volume
      isMuted = false;
      //console.log("AD ended! resuming volume");
  }
};

(function() {
    'use strict';
    window.userVolume = 0.1;
    window.isMuted = false;
    setInterval(muteAD, 100);
})();
