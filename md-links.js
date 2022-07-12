const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

const filePath = './dummy/README.md'; // ruta relativa
// ruta existe?
const existencePath = (filePath) => fs.existsSync(filePath); 
// console.log(existencePath(filePath))
// es ruta absoluta
const isAbsolutePath = (filePath) => path.isAbsolute(filePath);
 // pasar a ruta absoluta
const notAbsolutePath = (filePath) => path.resolve(filePath);
 // verificar extension
const extension = (filePath) => (path.extname(filePath) === '.md');
// console.log(extension(filePath))

const absolutPath = path.join(__dirname, filePath) // ruta absoluta

const readFile = (absolutPath) => {
    // return new Promise((resolve) => {
        const read = fs.readFileSync(absolutPath, 'utf8')
        const fileHtml = marked.parse(read)
        const $ = cheerio.load(fileHtml)
        const getLinks = $('a') 

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
// console.log(readFile(absolutPath))

const validate = (absolutPath) => {
    const fileRead = readFile(absolutPath)
    let fileArray = []

    fileRead.map((links) => {
        const validateLinks = axios.get(links.href)
            .then((response) => {
                const resp = {
                    href: links.href,
                    text: links.text,
                    file: links.file,
                    status: response.status,
                    statusText: response.statusText
                };
                return resp
            })
            .catch((error) => {
                if (error.response) {
                    const resp = {
                        href: links.href,
                        text: links.text,
                        file: links.file,
                        status: error.response.status,
                        statusText: 'Fail'
                    };
                    return resp
                };
            });
        fileArray.push(validateLinks)
    });
    return Promise.all(fileArray)
}
// validate(absolutPath).then(console.log)

const getAllFiles = (filePath, arrayOfFiles) => {
    const files = fs.readdirSync(filePath)
    arrayOfFiles = arrayOfFiles || []

    files.forEach((file) => {
        if (fs.statSync(filePath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath + "/" + file, arrayOfFiles)
        } else if (path.extname(file)==='.md'){
            const filemd = path.join(__dirname, file)
            arrayOfFiles.push({filemd})
        } 
    })
    return arrayOfFiles
}
// console.log(getAllFiles(filePath))

module.exports = { readFile, validate, isAbsolutePath, notAbsolutePath, existencePath, extension, getAllFiles };
