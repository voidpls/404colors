const puppeteer = require('puppeteer')
const { PORT } = process.env
const path = require('path')
const fs = require('fs')
// const html = fs.readFileSync('./colors.html', 'utf8');

const columnTemplate = `
    <div class="column">
        {{COLUMN}}
    </div>
`
const entryTemplate = `
    <div class="entry">
        <div class="colorBox" style="background:{{ROLE.COLOR}};"></div>
        <div class="colorName" style="color:{{ROLE.COLOR}};">{{ROLE.NAME}}</div>
    </div>
`

async function init () {
    const browser = puppeteer.launch({ headless: true, args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
    ]})
    return browser
}

async function screenshot(browser, roles) {
    const page = await browser.newPage()
    const html = fs.readFileSync('./colors.html', 'utf8');
    const genHTML = await getHTML(html, roles)
    await page.setViewport({ width: 900, height: 1})
    await page.goto(`file://${path.join(__dirname, 'empty.html')}`)
    await page.setContent(genHTML.replace(/\n/gm, ''))

    const screenshot = await page.screenshot({
        type: 'png',
        // quality: 100,
        encoding: 'binary',
        fullPage: true,
    })
    await page.close()
    return screenshot
}

async function getHTML(html, roles) {
    const numColumns = 3
    const columnLen = Math.ceil(roles.length/numColumns)
    let columns = ``
    for (let i=0; i<numColumns; i++) {
        let column = ''
        roles
            .slice(i*columnLen, (i+1)*columnLen)
            .map(role => {
                column = column + entryTemplate
                    .replace(/{{ROLE.COLOR}}/gm, role.color)
                    .replace(/{{ROLE.NAME}}/gm, role.name)
            })
        columns = columns + columnTemplate.replace('{{COLUMN}}', column)
    }
    // console.log(columns)

    html = html
        .replace('{{GRID_COLUMN_CSS}}', `calc(100vw/${numColumns}) `.repeat(numColumns))
        .replace('{{COLUMNS}}', columns)
    return html
}

exports.init = init
exports.screenshot = screenshot
