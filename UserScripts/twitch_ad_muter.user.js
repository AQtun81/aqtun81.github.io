// ==UserScript==
// @name         Twitch Automatic ADs muter
// @namespace    https://www.twitch.tv
// @version      1.2
// @description  Read Title :)
// @author       AQtun81

// @history      1.2 now the ADs are covered over with the small stream video preview
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

window.muteAD = function()
{
    var element = document.querySelector('[data-a-target="video-ad-label"]');

    if (element != null && !isMuted) // ADs started
    {
        var videoElement = document.querySelector(".video-player__container video");
        if (videoElement.muted) { return; } // stream is already muted, this prevents unmuting when ads end
        console.log('%c[ADs Muter]' + '%c Muting Player', 'background: #222; color: #32a869', '');
        isMuted = true;
        videoElement.muted = true;
        toggleOverlayOverADs(true);
    }
    else if (element == null && isMuted) // ADs ended
    {
        var videoElement = document.querySelector(".video-player__container video");
        console.log('%c[ADs Muter]' + '%c Resuming Player Volume', 'background: #222; color: #32a869', '');
        videoElement.muted = false;
        isMuted = false;
        toggleOverlayOverADs(false);
    }
};

window.toggleOverlayOverADs = function(toggle)
{
    var smallPlayerElement = document.querySelector('.picture-by-picture-player video[playsinline][webkit-playsinline]');
    if (smallPlayerElement == null) return;

    if (toggle === true)
    {
        var targetRect = document.querySelector(".video-player__container video").getBoundingClientRect();
        smallPlayerElement.style.setProperty('position', 'fixed', 'important');
        smallPlayerElement.style.setProperty('min-width', targetRect.width + 'px', 'important');
        smallPlayerElement.style.setProperty('width', targetRect.width + 'px', 'important');
        smallPlayerElement.style.setProperty('min-height', targetRect.height + 'px', 'important');
        smallPlayerElement.style.setProperty('height', targetRect.height + 'px', 'important');
        smallPlayerElement.style.setProperty('top', '0px', 'important');
        smallPlayerElement.style.setProperty('left', -targetRect.width + 'px', 'important');
        smallPlayerElement.style.setProperty('z-index', '999', 'important');
    }
    else
    {
        smallPlayerElement.style.position = '';
        smallPlayerElement.style.minWidth = '';
        smallPlayerElement.style.width = '';
        smallPlayerElement.style.minHeight = '';
        smallPlayerElement.style.height = '';
        smallPlayerElement.style.top = '';
        smallPlayerElement.style.left = '';
        smallPlayerElement.style.zIndex = '';
    }
};

(function() {
    'use strict';
    window.isMuted = false;
    setInterval(muteAD, 16);
})();
