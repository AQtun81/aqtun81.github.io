import { dotnet } from '../_framework/dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('main.js', {
    PlayAudio:            async (dataBytes)                                         => { await playAudio(dataBytes); },
    SetInnerText:               (elementId, text)                                   => { document.getElementById(elementId).innerHTML = text; },
    OnReady:                    ()                                                  => { document.dispatchEvent(new Event('cs:ready')); window.csReady = true; },
    DisplayNotification:        (prefix, username, suffix, message, usernameColor)  => { displayNotification(prefix, username, suffix, message, usernameColor); },
    DisplayNotificationsState:  (enabled, text)                                     => { displayNotificationsState(enabled, text); },
    SkipNotification:  ()                                                           => { skipNotification(); },
    DisplayConnected:  ()                                                           => { displayConnected(); },
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

window.cs = {
    onKeyPressed:       (text)    => exports.Program.OnKeyPressed(text),
    test:               (text)    => exports.Program.Test(text),
    playTTS:            (text)    => exports.Program.PlayTTS(text),
    setSecretKey:       (text)    => exports.Program.SetSecretKey(text),
    connectToChat:      (channel) => exports.Program.ConnectToChat(channel)
};

await dotnet.run();