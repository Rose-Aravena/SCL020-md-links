const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { readFile, validateLinks, statsLinks, isAbsolutePath, notAbsolutePath, existencePath, extension, getAllFiles, stats } = require('./md-links')

const mdLinks = (filePath, options) => {
  return new Promise ((resolve) => {
    const absolutePath = !isAbsolutePath(filePath) ? notAbsolutePath(filePath) : filePath;
    const validatePath = existencePath(absolutePath)

    if (validatePath){
      console.log(chalk.greenBright('La ruta si existe'))
      const extensionMD = extension(absolutePath)
      if(!extensionMD){
        console.log(chalk.cyan('La ruta es un directorio ') + chalk.yellow(fs.readdirSync(absolutePath)))
        console.log(chalk.blueBright('buscando archivo con extension ".md"....'))
        const getFile = getAllFiles(absolutePath)
        if(getFile.length === 0){
          console.log(chalk.red('Archivo ".md" no encontrado, comprueba la ruta del archivo: ')+chalk.yellow(absolutePath))
        }else{
          const arrayPromises = getFile.map((file) => {
            const filemd = file.filemd
            console.log(chalk.greenBright('Archivo encontrado, ruta definida: ')+chalk.yellow(filemd))
            return mdLinks(filemd, options)
          })
          resolve(Promise.all(arrayPromises))
        }
      }else if (options.validate) {
        console.log(chalk.blueBright('Validando los links....'))
        const valida = validateLinks(absolutePath)
        resolve(valida)
      }else if (options.stats) {
        const stats = statsLinks(absolutePath)
        resolve(stats)
      }else{
        console.log(chalk.blueBright('Imprimiendo informacion de links....'))
        const read = readFile(absolutePath)
        resolve(read)
      }
    } else {
      console.log(chalk.red('La ruta ingresada no es valida: ')+ chalk.yellow(absolutePath))
    }
  })
}

module.exports = {
  mdLinks,
};