const path = require('path')
const filePath = './README.md';

const mdLinks = (filePath, options) => {
  if (path.isAbsolute(filePath) == false)
  console.log('no es ruta absoluta')
  const absolutPath = path.join(__dirname, filePath)
  console.log('ahora si lo es' + absolutPath)
}
mdLinks(filePath)