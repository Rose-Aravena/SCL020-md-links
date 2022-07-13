#!/usr/bin/env node

const process = require('process');
const { mdLinks } = require('./index')

const cli = () =>{
    let options = {
        validate: false
    }
    if(process.argv[3]=== '--validate'){
        options.validate = true
    }
    mdLinks(process.argv[2], options).then((resp) => {
        console.log(resp);
    });
}
cli()