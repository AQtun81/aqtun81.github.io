const params = new URLSearchParams(window.location.search);
const subNotificationMain = document.getElementById("subNotificationMain");
const subNotificationImage = document.getElementById("subNotificationImage");
const subNotificationPrefix = document.getElementById("subNotificationPrefix");
const subNotificationUsername = document.getElementById("subNotificationUsername");
const subNotificationMessage = document.getElementById("subNotificationMessage");
const notificationsStateMain = document.getElementById("notificationsStateMain");
let AudioPlayer = new Audio();
let finishPlayback;
const randomRange = (min, max) => min + Math.random() * (max - min);
const pool = [];

const AUDIO_PRELOAD = ['mp3/gunshot.mp3', 'mp3/slap.mp3', 'mp3/wasted.mp3', 'mp3/pause.mp3', 'mp3/resume.mp3'];
AUDIO_PRELOAD.map(url => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    audio.load();
});

function poolAcquire()
{
    const element = pool.pop();
    if (element) { return element; }
    const p = document.createElement("p");
    p.className = "gift-sub-recipient-popup";
    document.body.appendChild(p);
    return p;
}

async function onLoad()
{
    if (!window.csReady) await new Promise(resolve => document.addEventListener('cs:ready', resolve, { once: true }));

    let volume = Number(params.get('tts-volume') ?? 0.5);
    let channel = params.get('channel');
    let secret = params.get('secret');
    let webhook = params.get('webhook');

    AudioPlayer.volume = volume;
    window.cs.setSecretKey(secret);
    window.cs.setWebhook(webhook);
    
    if (!channel)
    {
        const outElement = document.getElementById("out");
        outElement.querySelector("p").textContent = "Missing channel name URL parameter";
        outElement.querySelector("img").src = "icon/thumbs-down.svg";
        outElement.style.opacity = 1;
        outElement.style.background = "#D33";
        outElement.animate(
            [
                { opacity: 0 },
                { opacity: 1 },
            ],
            {
                duration: 250,
                easing: "cubic-bezier(0.3, 0.0, 0.7, 1.0)",
                fill: "none"
            });
        return;
    }
    window.cs.connectToChat(channel);
}

function playAudioImmediate(url)
{
    let immediatePlayer = new Audio(url);
    immediatePlayer.volume = AudioPlayer.volume;
    immediatePlayer.play();
}

async function playAudio(dataBytes)
{
    AudioPlayer.pause();
    AudioPlayer.removeAttribute("src");
    AudioPlayer.currentTime = 0;
    AudioPlayer.load();
    
    const blob = new Blob([dataBytes], {
        type: "audio/mpeg"
    });

    const abortController = new AbortController();
    let blobUrl;
    try
    {
        blobUrl = URL.createObjectURL(blob);
        AudioPlayer.src = blobUrl;
        AudioPlayer.preload = "auto";

        const playbackEnded = new Promise((resolve, reject) => {
            finishPlayback = resolve;
            AudioPlayer.addEventListener("ended", resolve, { once: true, signal: abortController.signal });
            AudioPlayer.addEventListener("error", reject, { once: true, signal: abortController.signal });
        });

        await AudioPlayer.play();
        await playbackEnded;
    }
    finally
    {
        abortController.abort();
        finishPlayback = null;
        URL.revokeObjectURL(blobUrl);
    }
}

function skipAudio()
{
    if (!finishPlayback) return;

    AudioPlayer.pause();
    AudioPlayer.currentTime = 0;
    finishPlayback();
}

function skipNotification()
{
    skipAudio();
    subNotificationMain.getAnimations().forEach(animation => animation.cancel());
}

function calculateTheSizeForNotificationText()
{
    subNotificationMessage.style.width = '';

    const totalWidth = document.body.scrollWidth;
    const totalHeight = document.body.scrollHeight;

    const minWidth = totalWidth * 0.425;
    const maxWidth = totalWidth * 0.90;
    const triggerHeight = totalHeight * 0.45;

    const fits = () => subNotificationMessage.scrollHeight <= triggerHeight;

    subNotificationMessage.style.width = minWidth + 'px';
    if (fits()) return;

    subNotificationMessage.style.width = maxWidth + 'px';
    if (!fits()) return;

    let lo = minWidth, hi = maxWidth;
    while (hi - lo > 1)
    {
        const mid = Math.round((lo + hi) / 2);
        subNotificationMessage.style.width = mid + 'px';
        fits() ? (hi = mid) : (lo = mid);
    }
    subNotificationMessage.style.width = hi + 'px';
}

function displayNotification(image, prefix, username, suffix, message, usernameColor)
{
    const FADE_IN_DURATION  = 350;
    const FADE_OUT_DURATION = 350;
    const TOTAL_DURATION    = 8000;
    
    const T1 = FADE_IN_DURATION / TOTAL_DURATION;
    const T2 = 1.0 - FADE_OUT_DURATION / TOTAL_DURATION;
    
    subNotificationImage.src = image;
    subNotificationPrefix.firstChild.textContent = prefix;
    subNotificationUsername.innerText = username;
    subNotificationPrefix.lastChild.textContent = suffix;
    subNotificationUsername.style.color = usernameColor;
    subNotificationMessage.innerText = message;
    calculateTheSizeForNotificationText();
    
    subNotificationMain.animate(
        [
            { offset: 0,  opacity: 0, marginTop: "150px" },
            { offset: T1, opacity: 1, marginTop: "20px"  },
            { offset: T2, opacity: 1 },
            { offset: 1,  opacity: 0 }
        ],
        {
            duration: TOTAL_DURATION,
            easing: "cubic-bezier(0.3, 0.0, 0.7, 1.0)",
            fill: "none"
        }
    );
}

function displayNotificationsState(enabled, text)
{
    const FADE_IN_DURATION  = 500;
    const FADE_OUT_DURATION = 500;
    const TOTAL_DURATION    = 4000;

    const DURATION_IN  = FADE_IN_DURATION / TOTAL_DURATION;
    const DURATION_OUT = FADE_OUT_DURATION / TOTAL_DURATION;
    
    const T1 = DURATION_IN     / 3;
    const T2 = DURATION_IN * 2 / 3;
    const T3 = DURATION_IN;
    const T4 = 1.0 - DURATION_OUT;
    const T5 = 1.0 - DURATION_OUT * 2 / 3;
    const T6 = 1.0 - DURATION_OUT     / 3;
    
    const textElement = notificationsStateMain.querySelector("p");
    const iconElement = notificationsStateMain.querySelector("img");
    
    if (enabled)
    {
        notificationsStateMain.style.background = "#294";
        iconElement.src = "icon/play.svg";
    }
    else
    {
        notificationsStateMain.style.background = "#D33";
        iconElement.src = "icon/pause.svg";
    }

    textElement.textContent = text;
    notificationsStateMain.getAnimations().forEach(animation => animation.cancel());

    const fullWidth = notificationsStateMain.scrollWidth;
    const iconWidth = 32;

    notificationsStateMain.animate(
        [
            { offset: 0,   opacity: 0, marginLeft: `-${fullWidth}px`, width: `${iconWidth}px` },
            { offset: T1,  opacity: 1, marginLeft: "20px"           , width: `${iconWidth}px` },
            { offset: T2,  opacity: 1, marginLeft: "20px"           , width: `${iconWidth}px` },
            { offset: T3,  opacity: 1, marginLeft: "20px"           , width: `${fullWidth}px` },
            { offset: T4,  opacity: 1, marginLeft: "20px"           , width: `${fullWidth}px` },
            { offset: T5,  opacity: 1, marginLeft: "20px"           , width: `${iconWidth}px` },
            { offset: T6,  opacity: 1, marginLeft: "20px"           , width: `${iconWidth}px` },
            { offset: 1,   opacity: 0, marginLeft: `-${fullWidth}px`, width: `${iconWidth}px` },
        ],
        {
            duration: TOTAL_DURATION,
            easing: "cubic-bezier(0.3, 0.0, 0.7, 1.0)",
            fill: "none"
        }
    );
}

async function displayConnected()
{
    const outElement = document.getElementById("out");
    let animation = outElement.animate(
        [
            {offset: 0.0000, opacity: 0.0},
            {offset: 0.0625, opacity: 1.0},
            {offset: 0.9375, opacity: 1.0},
            {offset: 1.0000, opacity: 0.0},
        ],
        {
            duration: 4000,
            easing: "cubic-bezier(0.3, 0.0, 0.7, 1.0)",
            fill: "none"
        });

    await animation.finished;
    
    outElement.remove();
}

async function displayMassGiftSubRecipient(text, color)
{
    // random sleep
    await new Promise(resolve => setTimeout(resolve, randomRange(1500, 4000)));
    
    const ENTRY = 700, HOLD = 2400, EXIT = 600;
    const DURATION = ENTRY + HOLD + EXIT;
    const EASE_OUT_BACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";
    const EASE_IN_OUT_SINE = "cubic-bezier(0.45, 0.05, 0.55, 0.95)";

    const el = poolAcquire();
    el.textContent = text;
    el.style.color = color;
    el.style.visibility = "visible";

    const rot = randomRange(-30, 30);
    const x = randomRange(10, 90);
    const y = randomRange(20, 90);

    const getTransform = (r, s) => `translate(${x}vw, ${y}vh) translate(-50%, -50%) rotate(${r}deg) scale(${s})`;

    const keyframes =
        [
            {
                transform: getTransform(rot + randomRange(120, 180) * (Math.random() < .5 ? -1 : 1), 0),
                opacity: 0,
                easing: EASE_OUT_BACK
            },
            {transform: getTransform(rot, 1), opacity: 1, offset: ENTRY / DURATION, easing: "linear"},
            {transform: getTransform(rot, 1), opacity: 1, offset: (ENTRY + HOLD) / DURATION, easing: EASE_IN_OUT_SINE},
            {transform: getTransform(rot, 1), opacity: 0},
        ];

    const anim = el.animate(keyframes, {duration: DURATION, fill: "none"});

    anim.onfinish = () => {
        el.style.visibility = "hidden";
        anim.cancel();
        pool.push(el);
    };
}

document.addEventListener("keydown", event =>
{
    window.cs.onKeyPressed(event.key);
});

onLoad();