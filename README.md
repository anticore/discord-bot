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
PLUGINS=
```

-   `TOKEN` is the discord bot token
-   `SILENT` is a boolean. if true, the app will not produce logs while running
-   `COMMAND_INDICATOR` character to identify when a command is being sent to the bot (eg. `!help` where `!` is the indicator)
-   `ADMIN_ROLE` discord role that a bot admin must have in order to run certain commands like `!loadplugin` and `!unloadplugin`
-   `PLUGINS` a list of plugin filenames separated by commas. if the file is `plugins/example.ts` the variable should be `PLUGINS=example`

additional environment variables may be needed for plugin specific features

## running

`yarn start`

if the environment variables and `plugins.json` file is setup correctly the bot should login to the server you added it to and should be able to accept commands
