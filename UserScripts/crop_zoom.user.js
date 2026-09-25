// ==UserScript==
// @name         Ctrl + Mouse Wheel Crop Zoom
// @version      1.0
// @description  Mimic pinch-zoom with Ctrl + Mouse Wheel
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const MIN_SCALE = 1.0;
    const MAX_SCALE = 25.0;
    const ZOOM_SPEED = -0.001;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    function clamp(value, min, max)
    {
        return Math.min(Math.max(value, min), max);
    }

    function applyTransform()
    {
        if (scale === 1 && translateX === 0 && translateY === 0)
        {
            document.documentElement.style.transform = '';
            document.documentElement.style.transformOrigin = '';
        }
        else
        {
            document.documentElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            document.documentElement.style.transformOrigin = '0 0';
        }
    }

    function wheelHandler(e)
    {
        if (!e.ctrlKey) return;

        e.preventDefault();
        e.stopPropagation();

        const oldScale = scale;

        scale *= 1.0 + e.deltaY * ZOOM_SPEED;
        scale = clamp(scale, MIN_SCALE, MAX_SCALE);

        if (scale === oldScale) return;

        const mouseX = e.clientX + window.scrollX;
        const mouseY = e.clientY + window.scrollY;

        const scaleChange = scale / oldScale;

        translateX = mouseX - scaleChange * (mouseX - translateX);
        translateY = mouseY - scaleChange * (mouseY - translateY);

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const scrollW = document.documentElement.scrollWidth;
        const scrollH = document.documentElement.scrollHeight;

        let minX = window.scrollX + viewportW - scrollW * scale;
        let maxX = window.scrollX;
        if (minX > maxX) minX = maxX;

        let minY = window.scrollY + viewportH - scrollH * scale;
        let maxY = window.scrollY;
        if (minY > maxY) minY = maxY;

        translateX = clamp(translateX, minX, maxX);
        translateY = clamp(translateY, minY, maxY);

        if (scale === MIN_SCALE)
        {
            const tx = translateX;
            const ty = translateY;
            translateX = 0;
            translateY = 0;
            applyTransform();
            window.scrollBy(-tx, -ty);
        }
        else
        {
            applyTransform();
        }
    }

    function keydownHandler(e)
    {
        if (e.ctrlKey && (e.key === '0' || e.code === 'Numpad0'))
        {
            if (scale === MIN_SCALE && translateX === 0 && translateY === 0) return;

            const centerX = document.documentElement.clientWidth / 2;
            const centerY = document.documentElement.clientHeight / 2;

            const docX = (centerX + window.scrollX - translateX) / scale;
            const docY = (centerY + window.scrollY - translateY) / scale;

            scale = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();

            window.scrollTo(docX - centerX, docY - centerY);
        }
    }

    document.addEventListener('wheel', wheelHandler, { passive: false, capture: true });
    document.addEventListener('keydown', keydownHandler, { capture: true });
})();