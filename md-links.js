const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

const filePath = './dummy/README.md'; // ruta relativa
// const files = fs.readdirSync('./') // Reads the contents of the directory
// console.log(files)
const existencePath = (filePath) => (fs.existsSync(filePath)); // ruta existe?
console.log(existencePath(filePath))

const extension = (filePath) => (path.extname(filePath) === '.md'); // verificar extension
console.log(extension(filePath))

const isFile = (filePath) => fs.statSync(filePath).isDirectory() // es un directorio?
console.log(isFile(filePath))

const absolutPath = path.join(__dirname, filePath) // ruta absoluta

const readFile = (absolutPath) => {
    // return new Promise((resolve) => {
        const read = fs.readFileSync(absolutPath, 'utf8')
        const fileHtml = marked.parse(read)
        const $ = cheerio.load(fileHtml)
        const getLinks = $('a') // indicamos lo que queremos extraer del html

        let arrayLinks = []
        getLinks.each((i, links) => {
            arrayLinks.push({
                href: $(links).attr('href'),
                text: $(links).text(),
                file: absolutPath
            })
        })
        return arrayLinks;
    //     resolve(arrayLinks)
    // })
}

const validate = (absolutPath) => {
    const fileRead = readFile(absolutPath)
    let fileArray = []

    fileRead.map((links) => {
        const url = links.href;
        const text = links.text;
        const file = links.file;

        const validateLinks = axios.get(url)
            .then((response) => {
                const resp = {
                    href: url,
                    text: text,
                    file: file,
                    status: response.status,
                    statusText: response.statusText
                };
                // console.log(resp)
                fileArray.push(resp)
                return resp
            })
            .catch((error) => {
                if (error.response) {
                    const resp = {
                        href: url,
                        text: text,
                        file: file,
                        status: error.response.status,
                    };
                    return resp
                };
            });
            validateLinks.then(resp => fileArray.push(resp))
    });
    return fileArray;
}
console.log(validate(absolutPath))

module.exports = { readFile, validate };
