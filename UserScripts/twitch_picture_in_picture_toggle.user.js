// ==UserScript==
// @name         Twitch PiP toggle for AQtun.tk
// @namespace    AQtun.tk
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

(function() {
    'use strict';
    window.addEventListener("message", function(event) {if (event.data == "EnablePiP") {document.querySelector(".highwind-video-player div video").requestPictureInPicture()}});
    console.log('%c Picture In Picture Toggle Enabled ', 'background: #222; color: #7bdf3d');
})();

window.displayPiP = function() {
    var root = document.querySelector(".player-controls__right-control-group.tw-align-items-center.tw-flex.tw-flex-grow-1.tw-justify-content-end");
    var div = document.createElement("div");
    root.appendChild(div);
    div.classList.add('tw-inline-flex');
    div.classList.add('tw-relative');
    div.classList.add('tw-tooltip-wrapper');
    div.onclick = function() {postMessage('EnablePiP', '*')};
    div.innerHTML = '<button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--border tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw relative" data-a-target="player-fullscreen-button" aria-label="Picture in Picture"><div class="tw-align-items-center tw-flex tw-flex-grow-0"><div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0"><span class="tw-button-icon__icon"><div style="width: 2rem; height: 2rem;"><div class="tw-align-items-center tw-full-width tw-icon tw-icon--fill tw-inline-flex"><div class="tw-aspect tw-aspect--align-top"><div class="tw-aspect__spacer" style="padding-bottom: 100%;"></div><svg class="tw-icon__svg" version="1.1" width="100%" height="100%" viewBox="0 0 24 24"><path d="M8,12H17.76L15.26,9.5L16.67,8.08L21.59,13L16.67,17.92L15.26,16.5L17.76,14H8V12M19,3C20.11,3 21,3.9 21,5V9.67L19,7.67V7H5V19H19V18.33L21,16.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19Z" /></svg></div></div></div></span></div></div></button><div class="tw-tooltip tw-tooltip--align-right tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip" id="6f2e445e66530d2f555f589005a97791">Picture in Picture</div>';
};

window.onload = function() {
    displayPiP();
};
