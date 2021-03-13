import { log } from "../log";
import { Plugin } from "../plugin";
const Discord = require("discord.js");

/**
 * Utils functionality plugin
 */
const UtilsPlugin: Plugin = {
    name: "utils",

    description: "random utilities",

    availableCommands: {
        flip: { description: "flip a coin" },
    },

    onCommand: async (_, message, command) => {
        if (command.id === "flip") {
            let r = Math.random();

            const embed = new Discord.MessageEmbed()
                .setTitle("Coin flip")
                .setDescription("The result is...")
                .setImage(
                    r < 0.5
                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Jefferson-Nickel-Unc-Obv.jpg/640px-Jefferson-Nickel-Unc-Obv.jpg?16156399735171"
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/United_States_penny%2C_reverse.jpg/640px-United_States_penny%2C_reverse.jpg?1615639956661"
                );

            message.channel.send(embed);
        }
    },
};

export default UtilsPlugin;
