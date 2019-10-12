// ==UserScript==
// @name         Open in Steam
// @namespace    https://steamcommunity.com/
// @version      1.0
// @description  Adds "Open in steam" buttons to steam workshop pages
// @author       AQtun81
// @match        https://steamcommunity.com/sharedfiles/filedetails*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("SubscribeItemBtn").parentElement.innerHTML += '<a onclick="ViewOnSteam();" class="btn_green_white_innerfade btn_border_2px btn_medium " style="right: 156px;width: 126px;"><span class="subscribeText" style="padding-left: 15px;"><div id="SubscribeItemOptionAdd" class="subscribeOption subscribe selected">Open in steam</div></span></a>';

})();

window.ViewOnSteam = function() {
    window.open('steam://openurl/' + window.location.href, "_self");
}
