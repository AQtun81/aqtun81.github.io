// ==UserScript==
// @name         No Google Redirect
// @namespace    http://tampermonkey.net/

// @version      1.1

// @history      1.1 Updated to work on current website
// @history      1.0 initial release

// @description  Removes Google redirect from Google searches improving page load time and removing tracking. Requires CSP disabled (security.csp.enable). More on CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// @author       AQtun81
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.removeRedirect = function() {
        if (window.rwt.toString().length == 535 || window.rwt.toString().length != 20) {
            window.rwt = function(a, b, c, d, e, f, g, h, k, l, m, n) {console.log("Moving directly to: " + a)};
            console.log("Successfully removed Google redirect function");
        } else {
            window.requestAnimationFrame(window.removeRedirect);
            //console.log("we will get them next time");
            //console.log("length: " + window.rwt.toString().length)
        }
    }
    window.requestAnimationFrame(window.removeRedirect);
})();