const axios = require('axios').default;
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

const existencePath = (filePath) => fs.existsSync(filePath); 

const isAbsolutePath = (filePath) => path.isAbsolute(filePath);

const notAbsolutePath = (filePath) => path.resolve(filePath);

const extension = (filePath) => (path.extname(filePath) === '.md');

const getAllFiles = (filePath, arrayOfFiles) => {
    const files = fs.readdirSync(filePath)
    arrayOfFiles = arrayOfFiles || []

    files.forEach((file) => {
        if (fs.statSync(filePath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath + "/" + file, arrayOfFiles)
        } else if (path.extname(file)==='.md'){
            const filemd = path.join(filePath, "/", file)
            arrayOfFiles.push({filemd})
        } 
    })
    return arrayOfFiles
}

const readFile = (absolutePath) => {
        const read = fs.readFileSync(absolutePath, 'utf8')
        const fileHtml = marked.parse(read)
        const $ = cheerio.load(fileHtml)
        const getLinks = $('a') 

        let arrayLinks = []
        getLinks.each((i, links) => {
            arrayLinks.push({
                href: $(links).attr('href'),
                text: $(links).text(),
                file: absolutePath
            })
        })
        return arrayLinks;
}

const validateLinks = (absolutePath) => {
    const fileRead = readFile(absolutePath)
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

const statsLinks = (absolutePath) => {
    const result = validateLinks(absolutePath).then(data => {
        let url = []
        let resp = {
            total: data.length,
            ok: 0,
            broken: 0,
        }
        data.map((links) => {
            if(links.statusText === 'OK'){
                resp.ok+=1
            }else if(links.statusText === 'Fail'){
                resp.broken+=1
            }
        })
        return resp
    })
    return result
}

module.exports = { readFile, validateLinks, statsLinks, isAbsolutePath, notAbsolutePath, existencePath, extension, getAllFiles };
