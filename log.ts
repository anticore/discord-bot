const chalk = require("chalk");

/**
 * Debug logger
 *
 * @param id - id tag
 * @param messages - messages to log
 */
export function log(id: string, ...messages: any[]) {
    if (process.env.SILENT === "true") return;
    console.log(chalk.bold.gray(`[${id}]\t`), ...messages);
}
