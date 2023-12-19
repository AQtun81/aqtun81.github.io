// ==UserScript==
// @name         Twitch Automatic ADs muter
// @namespace    https://www.twitch.tv
// @version      1.1
// @description  Read Title :)
// @author       AQtun81

// @history      1.1 updated
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
    var element = document.querySelector('[data-a-target="video-ad-label"]');

    // ADs started
    if (element != null && !isMuted) {
        var videoElement = document.querySelector(".video-player__container video");
        if (videoElement.muted) { return; } // stream is already muted, this prevents unmuting when ads end
        console.log('%c[ADs Muter]' + '%c Muting Player', 'background: #222; color: #32a869', '');
        isMuted = true;
        videoElement.muted = true;
        return;
    }

    // ADs ended
    if (element == null && isMuted) {
        var videoElement = document.querySelector(".video-player__container video");
        console.log('%c[ADs Muter]' + '%c Resuming Player Volume', 'background: #222; color: #32a869', '');
        videoElement.muted = false;
        isMuted = false;
        return;
    }
};

(function() {
    'use strict';
    window.isMuted = false;
    setInterval(muteAD, 16);
})();
