import { Command } from "./command";
import { log } from "./log";
import { Plugin } from "./plugin";

require("dotenv").config();

const Discord = require("discord.js");

const plugins: Plugin[] = [];

/**
 * Loads a list of startup plugins listed in the plugins.json
 */
async function loadPlugins() {
    let pluginVar = process.env.PLUGINS.split(",");

    pluginVar.forEach(async (plugin) => {
        // load each plugin
        const pluginModule = await import(`./plugins/${plugin}.ts`);

        // store on loaded plugins list
        plugins.push(pluginModule.default);

        log("plugin", "loaded", plugin);
    });
}

/**
 * Parses the content of a message and returns a command
 */
function parseContent(content: string): Command {
    const indicator = process.env.COMMAND_INDICATOR || "!";

    // if message content doesnt start with indicator, its not a command
    if (content[0] !== indicator) return;

    // if command id is empty, its not a command
    let contentSplit = content.split(/\s+/);
    if (contentSplit[0].length < 2) return;

    // parse command id
    let id = contentSplit[0].substring(1);

    // parse command arguments
    contentSplit.shift();

    return {
        id,
        args: contentSplit,
    };
}

/**
 * Starts the discord client and listeners
 */
function startDiscord() {
    const client = new Discord.Client();

    // client has logged in to the servers
    client.on("ready", () => {
        log("discord", "logged in as", client.user.tag);

        plugins.forEach(
            (plugin) => plugin.onLogin && plugin.onLogin(client, plugins)
        );
    });

    // client has received a message
    client.on("message", (msg) => {
        const command = parseContent(msg.content);

        // run plugin commands
        if (command) {
            plugins.forEach(
                (plugin) =>
                    plugin.onCommand &&
                    plugin.onCommand(client, msg, command, plugins)
            );
        }

        // run plugin message actions
        plugins.forEach(
            (plugin) =>
                plugin.onMessage && plugin.onMessage(client, msg, plugins)
        );
    });

    // login the client to the servers
    client.login(process.env.TOKEN);
}

async function main() {
    await loadPlugins();
    startDiscord();
}

main();
