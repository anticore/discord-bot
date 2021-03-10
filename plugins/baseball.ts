import { log } from "../log";
import { Plugin } from "../plugin";
const fetch = require("node-fetch");
const Discord = require("discord.js");

const teamCodeToLogo = {
    ARI:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/arizona-diamondbacks-logo-present.gif",

    ATL:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/atlanta-braves-logo-present.gif",

    BAL:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/baltimore-orioles-logo-present.gif",

    CHC:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/chicago-cubs-logo-present.gif",

    CWS:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/chicago-white-sox-logo-present.gif",
    CHW:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/chicago-white-sox-logo-present.gif",

    CIN:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/cincinnati-reds-logo-present.gif",

    CLE:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/cleveland-indians-logo-present.gif",

    COL:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/colorado-rockies-logo-present.gif",

    DET:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/detroit-tigers-logo-present.gif",

    FLA:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/florida-marlins-logo-present.gif",

    HOU:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/houston-astros-logo-present.gif",

    KAN:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/kansas-city-royals-logo-present.gif",

    LAA:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/los-angeles-angels-logo-present.gif",

    LAD:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/los-angeles-dodgers-logo-present.gif",

    MIL:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/milwaukee-brewes-logo-present.gif",

    MIN:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/minnesota-twins-logo-present.gif",

    NYM:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/new-york-mets-logo-present.gif",

    NYY:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/new-york-yankees-logo-present.gif",

    OAK:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/oakland-athletics-logo-present.gif",

    PHI:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/philadelphia-phillies-logo-present.gif",

    PIT:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/pittsburgh-pirates-logo-present.gif",

    SD:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/san-diego-padres-logo-present.gif",

    SEA:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/seattle-mariners-logo-present.gif",

    STL:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/st-louis-cardinals-logo-present.gif",

    TB:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/tampa-bay-rays-logo-present.gif",

    TEX:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/texas-rangers-logo-present.gif",

    TOR:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/toronto-blue-jays-logo-present.gif",

    WAS:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/washington-nationals-logo-present.gif",
    WSH:
        "https://findthatlogo.com/wp-content/gallery/mlb-team-logos/washington-nationals-logo-present.gif",
};

function paramsObjToString(params) {
    let s = "?";

    Object.keys(params).forEach(
        (param, index) =>
            (s += `${param}=${
                typeof params[param] === "string"
                    ? `'${params[param]}'`
                    : params[param]
            }${index < Object.keys(params).length - 1 ? "&" : ""}`)
    );

    return s;
}

async function req(endpoint, params) {
    const lookupUrl = `http://lookup-service-prod.mlb.com${endpoint}${paramsObjToString(
        params
    )}`;
    try {
        return await (await fetch(lookupUrl)).json();
    } catch (err) {
        log("baseball", err);
        return null;
    }
}

async function playerDetailsEmbed(playerId) {
    const player = (
        await req("/json/named.player_info.bam", {
            sport_code: "mlb",
            player_id: playerId,
        })
    ).player_info.queryResults.row;

    let isPitcher = player.primary_position_txt === "P";

    let careerStats;
    if (isPitcher) {
        careerStats = (
            await req("/json/named.sport_career_pitching.bam", {
                league_list_id: "mlb",
                game_type: "R",
                player_id: playerId,
            })
        ).sport_career_pitching.queryResults.row;
    } else {
        careerStats = (
            await req("/json/named.sport_career_hitting.bam", {
                league_list_id: "mlb",
                game_type: "R",
                player_id: playerId,
            })
        ).sport_career_hitting.queryResults.row;
    }

    let isDead = player.death_date.length > 0;
    let isRetired = player.end_date.length > 1;
    let isActive = !isDead && !isRetired;

    let lastSeasonStats;
    if (isActive) {
        if (isPitcher) {
            lastSeasonStats = (
                await req("/json/named.sport_pitching_tm.bam", {
                    league_list_id: "mlb",
                    game_type: "R",
                    season: "2020",
                    player_id: playerId,
                })
            ).sport_pitching_tm.queryResults.row;
        } else {
            lastSeasonStats = (
                await req("/json/named.sport_hitting_tm.bam", {
                    league_list_id: "mlb",
                    game_type: "R",
                    season: "2020",
                    player_id: playerId,
                })
            ).sport_hitting_tm.queryResults.row;
        }
    }

    const embed = new Discord.MessageEmbed();

    let title = player.name_display_first_last;
    if (isDead) title += " (†)";
    else if (isRetired) title += " (R)";

    embed
        .setTitle(title)
        .setImage(
            `https://img.mlbstatic.com/mlb-photos/image/upload/w_213,q_100/v1/people/${player.player_id}/headshot/67/current`
        );

    if (isActive) {
        embed.setThumbnail(teamCodeToLogo[player.team_abbrev]);
    }

    if (player.name_nick.length > 0) embed.setDescription(player.name_nick);

    if (isActive) {
        if (!isPitcher) {
            embed.addFields(
                {
                    name: "2020 Stats",
                    value: `**AB**: \`${lastSeasonStats.ab}\` | **H**: \`${lastSeasonStats.h}\` | **HR**: \`${lastSeasonStats.hr}\` | **BA**: \`${lastSeasonStats.avg}\` | **RBI**: \`${lastSeasonStats.rbi}\``,
                },
                {
                    name: "2020 slash line",
                    value: `\`${lastSeasonStats.avg}/${lastSeasonStats.slg}/${lastSeasonStats.ops}\``,
                    inline: true,
                }
            );
        } else {
            embed.addFields({
                name: "2020 Stats",
                value: `**W**: \`${lastSeasonStats.w}\` | **L**: \`${lastSeasonStats.l}\` | **ERA**: \`${lastSeasonStats.era}\` | **WHIP**: \`${lastSeasonStats.whip}\` | **KBB**: \`${lastSeasonStats.kbb}\``,
            });
        }
    }

    if (!isPitcher) {
        embed.addFields(
            {
                name: "Career Stats",
                value: `**AB**: \`${careerStats.ab}\` | **H**: \`${careerStats.h}\` | **HR**: \`${careerStats.hr}\` | **BA**: \`${careerStats.avg}\` | **RBI**: \`${careerStats.rbi}\``,
            },
            {
                name: "Career slash line",
                value: `\`${careerStats.avg}/${careerStats.slg}/${careerStats.ops}\``,
                inline: true,
            }
        );
    } else {
        embed.addFields({
            name: "Career Stats",
            value: `**W**: \`${careerStats.w}\` | **L**: \`${careerStats.l}\` | **ERA**: \`${careerStats.era}\` | **WHIP**: \`${careerStats.whip}\` | **KBB**: \`${careerStats.kbb}\``,
        });
    }

    // .setDescription(
    //     `${player.team_abbrev} |${player.primary_position_txt} |*${player.bats}/${player.throws}`
    // )
    // .addFields(
    //     isPitcher
    //         ? {
    //               name: "Career stats",
    //               value: `${stats.era}/${stats.whip}/${stats.kbb}`,
    //           }
    //         : {
    //               name: "Career slash line",
    //               value: `${stats.avg}/${stats.slg}/${stats.ops}`,
    //           }
    // )

    // .setThumbnail(teamCodeToLogo[player.team_abbrev])
    embed.setFooter(
        "Stats obtained from MLB Lookup Service API. Player images obtained from mlb.com."
    );
    return embed;
}

/**
 * Baseball stuff plugin
 */
const BaseballPlugin: Plugin = {
    name: "baseball",

    description: "commands for retrieving baseball info",

    availableCommands: {},

    onLogin: async () => {},

    onCommand: async (_, message, command) => {
        if (command.id === "player") {
            let playerName = command.args.join(" ");
            const resActive = (
                await req("/json/named.search_player_all.bam", {
                    sport_code: "mlb",
                    active_sw: "Y",
                    name_part: playerName,
                })
            ).search_player_all.queryResults;
            const resInactive = (
                await req("/json/named.search_player_all.bam", {
                    sport_code: "mlb",
                    active_sw: "N",
                    name_part: playerName,
                })
            ).search_player_all.queryResults;

            let res: any[] = [];
            if (resActive.row)
                res = Array.isArray(resActive.row)
                    ? [...res, ...resActive.row]
                    : [...res, resActive.row];
            if (resInactive.row)
                res = Array.isArray(resInactive.row)
                    ? [...res, ...resInactive.row]
                    : [...res, resInactive.row];

            if (res.length === 0) {
                message.channel.send("No player found.");
            } else if (res.length > 1) {
                let answer =
                    "More than one player found.\n\nUse `!playerid <id>` to specify which player you were looking for:\n";

                res.forEach(
                    (player) =>
                        (answer += `**ID:** \`${
                            player.player_id
                        }\`\t**Name:** ${
                            player.name_display_first_last
                        }\t**Team:** ${player.team_abbrev}\t**Position:** ${
                            player.position
                        }\t**Debut:** ${new Date(
                            player.pro_debut_date
                        ).toDateString()} \n`)
                );

                message.channel.send(answer);
            } else if (res.length === 1) {
                let player = res[0];
                let playerId = player.player_id;

                const embed = await playerDetailsEmbed(playerId);

                message.channel.send(embed);
            }
        }

        if (command.id === "playerid") {
            if (command.args.length < 1) {
                message.channel.send("No player found");
                return;
            }

            let playerId = command.args[0];

            const embed = await playerDetailsEmbed(playerId);

            message.channel.send(embed);
        }
    },
};

export default BaseballPlugin;
