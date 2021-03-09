# discord-bot

basic discord bot with a plugin system for adding functionality.

## installing and configuring

### install dependencies

`yarn install`

### create .env file

create a `.env` file in the root of the project containing the following variables

```
TOKEN=
SILENT=
COMMAND_INDICATOR=
ADMIN_ROLE=
```

-   `TOKEN` is the discord bot token
-   `SILENT` is a boolean. if true, the app will not produce logs while running
-   `COMMAND_INDICATOR` character to identify when a command is being sent to the bot (eg. `!help` where `!` is the indicator)
-   `ADMIN_ROLE` discord role that a bot admin must have in order to run certain commands like `!loadplugin` and `!unloadplugin`

additional environment variables may be needed for plugin specific features

### create plugins.json file

the `plugins.json` configures which plugins get loaded when the app starts. it's an array of objects of the format `{ name: string }` where the name property must match the filename of the plugin. for example, if you have the plugin file in `plugins/example.ts` the plugin name must be `example`. extra properties can be added to each plugin's configuration object and are passed to the plugin.

a `plugins.json` file with just the basic plugins configured looks like this:

```
[{ "plugin": "help" }, { "plugin": "core" }]
```

## running

`yarn start`

if the environment variables and `plugins.json` file is setup correctly the bot should login to the server you added it to and should be able to accept commands
