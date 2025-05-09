import { DiscordSDK } from "@discord/embedded-app-sdk";

// import "./style.css";
import '../bin/js-dos.css'

if (window.origin.includes("localhost")) {
  emulators.pathPrefix = "/.proxy/lib/";
  Dos(document.getElementById("gameUI"), {
    style: "none",
    noSideBar: true,
    noFullscreen: true,
    noSocialLinks: true
  }).run( window.origin + "/.proxy/lib/doom.jsdos");
}

let auth;
let clientId ="1242925143672619150" // import.meta.env.VITE_DISCORD_CLIENT_ID;
const discordSdk = new DiscordSDK(clientId, {
  disableConsoleLogOverride: false
});

// qol logging function
function out(message) {
  discordSdk.commands.captureLog({
    level: 'log',
    message: `[@Doom] ${message}`
  });
}

setupDiscordSdk().then(() => {
  // Auth OK

  // Check for hwaccel
  discordSdk.commands.encourageHardwareAcceleration().then((enabled) => {
    out(`HWACCEL: ${enabled === true ? 'enabled' : 'disabled'}`);
  })

  discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
    let cname = channel.name || "VC" // cname = Activity Channel Name OR "VC" if name couldnt be found
    discordSdk.commands.setActivity({ // Set the User's RPC Activity
      activity: {
        type: 0,
        details: 'DOOM©️ 1993',
        state: `Playing in 🔊 ${cname}!`,
        assets: {
          large_image: "embedded_cover",
          large_text: "Doom... In Discord!"
        },
        timestamps: {
          start: Date.now()
        },
        buttons: [ // Placeholder
          { label: 'What is this', url: 'https://discord.com/developers/docs/activities/overview' }
        ]
      }
    });
  })

   // Run the actual game:
   emulators.pathPrefix = "/.proxy/lib/";
   Dos(document.getElementById("gameUI"), {
     style: "none",
     noSideBar: true,
     noFullscreen: true,
     noSocialLinks: true
   }).run( window.origin + "/.proxy/lib/doom.jsdos");
});

async function setupDiscordSdk() {
  await discordSdk.ready();

  // Authorize with Discord client
  const { code } = await discordSdk.commands.authorize({
    client_id: clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: [
      "identify",
      "guilds",
      "rpc.activities.write",
    ],
  });

  // Get token from our api
  const response = await fetch("/.proxy/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const { access_token } = await response.json();

  // Use token to authenticate with the client
  auth = await discordSdk.commands.authenticate({
    access_token,
  });

  if (auth == null) { // Uh oh..
    throw new Error("Authenticate command failed");
  }

  // Set up thermal protection
  const handleThermalStateUpdate = (thermalState) => {
    switch (thermalState) {
      case 2: //Common.ThermalStateTypeObject.SERIOUS:
        alert("Consider taking a break soon. Your device is beginning to run hot!")
      case 3: //Common.ThermalStateTypeObject.CRITICAL:
        discordSdk.close(1006, "Device is getting too hot.")
    }
  }

  discordSdk.subscribe('THERMAL_STATE_UPDATE', handleThermalStateUpdate);
}