const {
    BOT_TOKEN,
    GUILD,
    TOP_DIVIDER,
    BOTTOM_DIVIDER
} = process.env
var events = require('events')
const { Client } = require('discord.js')

async function getColors (bot) {
    const guild = bot.guilds.resolve(GUILD)
    const roles = await guild.roles.fetch()
    const top = roles.cache.get(TOP_DIVIDER)
    const bottom = roles.cache.get(BOTTOM_DIVIDER)
    const colorRoles = roles.cache
        .filter(r => r.position < top.position && r.position > bottom.position)
        .map(r => {
            return {
                name: r.name,
                id: r.id,
                position: r.position,
                color: r.hexColor
            }
        })
        .sort((a,b) => b.position - a.position)
    return colorRoles
}

const bot = new Client({
    disabledEvents: [
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'CHANNEL_CREATE',
        'CHANNEL_DELETE',
        'CHANNEL_UPDATE',
        'CHANNEL_PINS_UPDATE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'USER_UPDATE',
        'USER_NOTE_UPDATE',
        'USER_SETTINGS_UPDATE',
        'PRESENCE_UPDATE',
        'VOICE_STATE_UPDATE',
        'TYPING_START',
        'VOICE_SERVER_UPDATE',
        'RELATIONSHIP_ADD',
        'RELATIONSHIP_REMOVE'
    ],
    disableEveryone: true
})

exports.discord = bot
exports.getColors = getColors

bot.login(BOT_TOKEN)
