import { Plugin } from "../plugin";

/**
 * Plugin for providing help for bot usage.
 */
const HelpPlugin: Plugin = {
    name: "help",
    hideFromHelp: true,

    onCommand: (_, message, command, plugins) => {
        /**
         * Sends a list of commands to the user via direct message
         */
        if (command.id === "help") {
            let helpString =
                "**Bot usage help**\nThis is a list of loaded plugins and respective commands available for this bot. For more information contact the server administrators.\n\n";

            plugins.forEach((plugin) => {
                if (plugin.hideFromHelp) return;

                if (plugin.description)
                    helpString += `${plugin.name} plugin - ${plugin.description}\n`;

                if (plugin.availableCommands) {
                    Object.keys(plugin.availableCommands).forEach(
                        (commandId) =>
                            (helpString += `\`!${commandId}\` -- ${plugin.availableCommands[commandId].description}\n`)
                    );

                    helpString += "\n";
                }
            });

            message.author.send(helpString);
        }
    },
};

export default HelpPlugin;
