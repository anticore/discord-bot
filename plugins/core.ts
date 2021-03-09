import { log } from "../log";
import { Plugin } from "../plugin";

/**
 * Core functionality plugin
 */
const CorePlugin: Plugin = {
    name: "core",

    description: "base functionality",

    availableCommands: {
        ping: { description: "check if the bot is responding" },
    },

    onCommand: async (_, message, command, plugins) => {
        /**
         * Checks if bot is responding
         */
        if (command.id === "ping") {
            message.channel.send("yes hello");
        }

        /**
         * Loads a plugin in runtime
         */
        if (command.id === "loadplugin") {
            if (message.member.roles.cache.find((r) => r.name === "botlord")) {
                let pluginId = command.args[0];

                try {
                    const pluginModule = await import(`./${pluginId}.ts`);
                    plugins.push(pluginModule.default);
                    message.reply(`${pluginId} loaded successfully.`);
                    log("core", "loaded", pluginId);
                } catch (error) {
                    message.reply(`${pluginId} failed loading.`);
                    log("core", "failed loading", pluginId);
                }
            }
        }

        /**
         * Unloads a loaded plugin
         */
        if (command.id === "unloadplugin") {
            if (message.member.roles.cache.find((r) => r.name === "botlord")) {
                let pluginId = command.args[0];

                let plugin = plugins.find((p) => p.name === pluginId);

                if (!plugin) {
                    message.reply(`${pluginId} is not loaded.`);
                    return;
                }

                plugins.splice(plugins.indexOf(plugin), 1);
                message.reply(`${pluginId} has been unloaded.`);
                log("core", "unloaded", pluginId);
            }
        }
    },
};

export default CorePlugin;
