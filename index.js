const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { readFile, validate, isAbsolutePath, notAbsolutePath, existencePath, extension, getAllFiles } = require('./md-links')

const filePath = './dummy/README.md';

const mdLinks = (filePath, options) => {
  return new Promise ((resolve, reject) => {
    // pasar a ruta absoluta 
    const absolutePath = !isAbsolutePath(filePath) ? notAbsolutePath(filePath) : filePath;
    console.log(absolutePath)
    // la ruta existe?
    const validatePath = existencePath(absolutePath)

    if (validatePath){ // si la ruta existe
      console.log(chalk.greenBright('La ruta si existe'))
      const extensionMD = extension(absolutePath) // es un archivo .md?
      if(!extensionMD){ // si es archivo .md
        console.log(chalk.cyan('La ruta es un directorio ') + chalk.yellow(fs.readdirSync(absolutePath)))
        console.log(chalk.blueBright('buscando archivo con extension .md...'))
        const getFile = getAllFiles(absolutePath)
        if(getFile.length === 0){
          console.log(chalk.red('Archivo ".md" no encontrado, comprueba la ruta del archivo: ')+chalk.yellow(absolutePath))
        }else{
          getFile.map((file) => {
            const filemd = file.filemd
            console.log(chalk.greenBright('Archivo encontrado, ruta definida es: ')+chalk.yellow(filemd))
            mdLinks(filemd)
          })
        }
      }else if (options.validate === 'true') {
        console.log('opstions validate')
      }else{
        return readFile(absolutePath)
      }
    } else {
      console.log(chalk.red('La ruta ingresada no es valida: ')+ chalk.yellow(absolutePath))
    } 
  })
}
console.log(mdLinks(filePath))