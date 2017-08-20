let scg = require('./all-files.js').single.scg;
let template = require('./scg-single-template').scg;
let file = process.argv[2];
//don't scare, it's just function which returns function which returns function
require("./create-html-file.js").buildSingle(template)(file)(scg);