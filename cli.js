#!/usr/bin/env node

const process = require('process');
const { mdLinks } = require('./index')

const cli = () =>{
    let options = {
        validate: false
    }
    if(process.argv[2]=== '--validate'){
        options.validate = true
    }
}