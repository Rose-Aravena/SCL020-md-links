const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { readFile, validateLinks, isAbsolutePath, notAbsolutePath, existencePath, extension, getAllFiles } = require('./md-links')

const filePath = './dummy/';

const mdLinks = (filePath, options) => {
  return new Promise ((resolve, reject) => {
    // pasar a ruta absoluta 
    const absolutePath = !isAbsolutePath(filePath) ? notAbsolutePath(filePath) : filePath;
    // la ruta existe? true o false
    const validatePath = existencePath(absolutePath)

    if (validatePath){ // si la ruta existe
      console.log(chalk.greenBright('La ruta si existe'))
      const extensionMD = extension(absolutePath) // es un archivo .md? true o false
      if(!extensionMD){ // si no es archivo .md
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
      }
      if (options.validate) {
        console.log(chalk.blueBright('Validando los links....'))
        const valida = validateLinks(absolutePath)
        resolve(valida)
      }
      else{
        const read = readFile(absolutePath)
        console.log(chalk.blueBright('Imprimiendo informacion de links....'))
        resolve(read)
      }
    } else {
      console.log(chalk.red('La ruta ingresada no es valida: ')+ chalk.yellow(absolutePath))
      reject('La ruta ingresada no es valida: ') 
    }
  })
}
// mdLinks(filePath).then((result) => {
//   console.log(result, 'aca esta el resultado')
// }).catch( (error) => {
//   console.log(error)
// })

module.exports = {
  mdLinks,
};