
const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path')
const marked = require('marked');
const cheerio = require('cheerio');

// const files = fs.readdirSync('./') // Reads the contents of the directory. Returns: <string[]>
const arch = './dummy/README.md'
// fs.readFile(arch, 'utf8', (error, data) => {
//     if(error) return console.error(error);
//     console.log(data);
// })

const read = fs.readFileSync(arch, 'utf8')
const html = marked.parse(read)
const $ = cheerio.load(html)
const resul = $('p a') // indicamos lo que queremos extraer del html
console.log(html)
console.log(resul.attr('href'))
console.log(resul.text())