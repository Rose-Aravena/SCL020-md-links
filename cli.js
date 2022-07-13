#!/usr/bin/env node

const process = require('process');
const { mdLinks } = require('./index')

const cli = () =>{
    let path = process.argv[2];
    let options = {
        validate: false
    }
    if(process.argv[3]=== '--validate'){
        options.validate = true
    }
    mdLinks(path, options).then((resp) => {
        console.log(resp);
    });
}
cli()