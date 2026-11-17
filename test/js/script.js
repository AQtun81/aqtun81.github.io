const params = new URLSearchParams(window.location.search);
const subNotificationMain = document.getElementById("subNotificationMain");
const subNotificationPrefix = document.getElementById("subNotificationPrefix");
const subNotificationUsername = document.getElementById("subNotificationUsername");
const subNotificationMessage = document.getElementById("subNotificationMessage");
const notificationsStateMain = document.getElementById("notificationsStateMain");
let AudioPlayer = new Audio();
let finishPlayback;

async function onLoad()
{
    if (!window.csReady) await new Promise(resolve => document.addEventListener('cs:ready', resolve, { once: true }));

    let volume = Number(params.get('tts-volume') ?? 0.5);
    let channel = params.get('channel');
    let secret = params.get('secret');

    AudioPlayer.volume = volume;
    window.cs.setSecretKey(secret);
    
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

function displayNotification(prefix, username, suffix, message, usernameColor)
{
    const FADE_IN_DURATION  = 350;
    const FADE_OUT_DURATION = 350;
    const TOTAL_DURATION    = 8000;
    
    const T1 = FADE_IN_DURATION / TOTAL_DURATION;
    const T2 = 1.0 - FADE_OUT_DURATION / TOTAL_DURATION;
    
    subNotificationPrefix.firstChild.textContent = prefix;
    subNotificationUsername.innerText = username;
    subNotificationPrefix.lastChild.textContent = suffix;
    subNotificationUsername.style.color = usernameColor;
    subNotificationMessage.innerText = message;
    
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

document.addEventListener("keydown", event =>
{
    window.cs.onKeyPressed(event.key);
});

onLoad();