const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

// const files = fs.readdirSync('./') // Reads the contents of the directory. Returns: <string[]>
// console.log(files)

const filePath = './dummy/README.md'; // ruta relativa

// const absolutPath = path.join(__dirname, filePath) // ruta absoluta

const readFile = (filePath) => {
    const prom = new Promise((resolve) => {
        const read = fs.readFileSync(filePath, 'utf8')
        const fileHtml = marked.parse(read)
        const $ = cheerio.load(fileHtml)
        const getLinks = $('a') // indicamos lo que queremos extraer del html

        let arrayLinks = []
        getLinks.each((i, links) => {
            arrayLinks.push({
                href: $(links).attr('href'),
                text: $(links).text(),
                file: filePath
            })
        })
        resolve(arrayLinks)
    })
    prom
        .then()
}
console.log(readFile(filePath))

const validate = (filePath) => {
    const fileRead = readFile(filePath)
    let fileArray = []

    fileRead.map((links) => {
        const href = links.href;
        const text = links.text;
        const file = links.file

        const validateS = axios.get(href)
            .then((response) => {
                const resp = {
                    href: href,
                    text: text,
                    file: file,
                    status: response.status,
                    statusText: response.statusText
                };
                return resp
            })
            .catch((error) => {
                if (error.response) {
                    const resp = {
                        href: href,
                        text: text,
                        file: file,
                        status: error.response.status,
                    };
                    return resp
                };
            });
        fileArray.push(validateS);
    });
    return fileArray;
}

module.exports = { readFile, validate };