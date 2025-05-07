/*
  Author: @neodevils
  Feel free to share it for others to don't deal with this issue when launching their activity on bot!
*/

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const token = process.env.DISCORD_BOT_TOKEN; // Your bot token
const clientId = process.env.VITE_DISCORD_CLIENT_ID; // Your bot client ID

// const guildId = "YOUR_GUILD_ID";  Optional, for guild-specific commands

const rest = new REST({ version: "10" }).setToken(token);

async function fetchCommands() {
    try {
        console.log("Fetching global commands...");
        const globalCommands = await rest.get(
            Routes.applicationCommands(clientId)
        );
        console.log("Global Commands:", globalCommands);

        console.log("Fetching guild commands...");
        /* const guildCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );
        console.log("Guild Commands:", guildCommands);
        */

        console.log("\nList of Commands:");
        // Or you can use [...globalCommands, ...guildCommands]
        [...globalCommands].forEach((cmd) => {
            console.log(
                `- Name: ${cmd.name}, ID: ${cmd.id}, Type: ${cmd.type}`
            );
        });

        // The command is ID to delete
        // - Name: launch, ID: ********************, Type: 4
        const commandIdToDelete = "LAUNCH_COMMAND_ID";

        await rest.delete(
            Routes.applicationCommand(clientId, commandIdToDelete)
        );
        console.log(
            `Successfully deleted command with ID: ${commandIdToDelete}`
        );
    } catch (error) {
        console.error("Error fetching commands:", error);
    }
}

fetchCommands();
