// ==UserScript==
// @name         Open in Steam
// @namespace    https://steamcommunity.com/

// @version      1.0

// @history      1.0 initial release

// @description  Adds "Open in steam" buttons to steam workshop pages
// @author       AQtun81
// @match        https://steamcommunity.com/sharedfiles/filedetails*
// @match        https://steamcommunity.com/workshop/filedetails*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    var buttonArea = document.getElementById("SubscribeItemBtn").parentElement;
    buttonArea.style.width = "0px";
    buttonArea.innerHTML += '<a onclick="ViewOnSteam();" class="btn_green_white_innerfade btn_border_2px btn_medium " style="right: 156px;width: 135px;"><span class="subscribeText" style="padding-left: 15px;"><div id="SubscribeItemOptionAdd" class="subscribeOption subscribe selected">Open in Steam</div></span></a>';

})();

window.ViewOnSteam = function() {
    window.open('steam://openurl/' + window.location.href, "_self");
}
