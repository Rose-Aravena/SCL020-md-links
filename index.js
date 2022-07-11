const { readFile, validate } = require('./md-links')
const path = require('path')

const filePath = './dummy/README.md';

const mdLinks = (filePath, options) => {
  return new Promise ((resolve, reject) => {

    if (!fs.existsSync(filePath)){

      const absolutPath = path.join(__dirname, filePath)
      // readFile(absolutPath)
      console.log(validate(absolutPath))
    } else {
      console.log(`Si es ruta absoluta ${filePath}`)
      console.log(readFile(filePath))
    }
  })
}