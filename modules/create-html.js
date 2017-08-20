let a = require('./all-files.js');
let state = a[process.argv[2]];
let file = process.argv[3];

//don't scare, it's just function which returns function which returns function
require("./create-html-file.js").buildComponent(file)(state);