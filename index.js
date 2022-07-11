const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { readFile, validate, isAbsolutePath, notAbsolutePath, existencePath, extension } = require('./md-links')

const filePath = './dummy/README.md';

const mdLinks = (filePath, options) => {
  return new Promise ((resolve, reject) => {
    const absolutePath = !isAbsolutePath(filePath) ? notAbsolutePath(filePath) : filePath;
    const validatePath = existencePath(absolutePath)
    console.log(absolutePath)
    if (validatePath){
      console.log(chalk.greenBright('La ruta si existe'))
      const extensionPath = extension(absolutePath)
      if(extensionPath){
        console.log(readFile(absolutePath))
      }else{
        console.log(chalk.cyan('La ruta es un directorio ') + chalk.yellow(fs.readdirSync(absolutePath)))
      }
    } else {
      console.log(chalk.red('La ruta ingresada no es valida: ')+ chalk.yellow(`${absolutePath}`))
    } 
  })
}
console.log(mdLinks(filePath))