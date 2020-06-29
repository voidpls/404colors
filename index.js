require('dotenv').config()
const { PORT } = process.env
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
    // app.use(express.static('public'))
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
})()
