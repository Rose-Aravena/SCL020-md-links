const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

// const files = fs.readdirSync('./') // Reads the contents of the directory. Returns: <string[]>
// console.log(files)

const filePath = './README.md'; // ruta relativa
const fileName = path.basename(filePath) // nombre del archivo
const absolutPath = path.join(__dirname, filePath) // ruta absoluta

const readFile = (absolutPath) => {
    const read = fs.readFileSync(absolutPath, 'utf8')
    const fileHtml = marked.parse(read)
    const $ = cheerio.load(fileHtml)
    const getLinks = $('a') // indicamos lo que queremos extraer del html

    let arrayLinks = []
    getLinks.each((i, links) => {
        arrayLinks.push({
            href: $(links).attr('href'),
            text: $(links).text(),
            file: fileName
        })
    })
    return arrayLinks
}
// console.log(readFile(absolutPath));
console.log(absolutPath)
console.log(path.isAbsolute(absolutPath));