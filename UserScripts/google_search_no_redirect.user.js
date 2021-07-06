// ==UserScript==
// @name         No Google Search Redirect
// @namespace    https://www.google.com

// @version      1.0

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
        if (window.rwt.toString().length == 672) {
            window.rwt = function(a, b, c, d, e, f, g, h, k, l, m, n) {console.log("Redirecting directly to: " + a)};
            console.log("Successfully removed Google redirect function");
        } else {
            window.requestAnimationFrame(window.removeRedirect);
            //console.log("we will get them next time");
            //console.log("length: " + window.rwt.toString().length)
        }
    }
    window.requestAnimationFrame(window.removeRedirect);
})();