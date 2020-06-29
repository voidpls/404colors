require('dotenv').config()
const { PORT, PREFIX, GUILD } = process.env
const { discord, getColors } = require('./bot.js')
const canvas = require('./canvas.js')
const express = require('express')
const app = express()

function initServer() {
    app.listen(PORT, () => console.log(`EXPRESS: Listening on port ${PORT}`));
}

(async () => {
    const browser = await canvas.init()
    if (browser) console.log('PUPPETEER: Spawned headless Chromium')
    app.get('/colors.json', async (req, res) => {
        const colorRoles = await getColors(discord)
        res.send(colorRoles)
    })
    app.get('/colors.png', async (req, res) => {
        const colorRoles = await getColors(discord)
        const screenshot = await canvas.screenshot(browser, colorRoles)
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshot.length
        })
        res.end(screenshot)
    })
    discord.once('ready', () => {
        console.log(`DISCORD: Initalized as ${discord.user.username}#${discord.user.discriminator}`)
        initServer()
    })
    discord.on('message', async msg => {
        if (!msg.content.startsWith(PREFIX) || msg.guild.id !== GUILD) return
        const cmd = msg.content.slice(PREFIX.length).toLowerCase()
        if (['colors', 'colours'].includes(cmd)) {
            const colorRoles = await getColors(discord)
            const screenshot = await canvas.screenshot(browser, colorRoles)
            await msg.channel.send({files:[{attachment: screenshot, name:'colors.png'}]})
        }
    })
})()
