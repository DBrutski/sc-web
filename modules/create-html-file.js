let scriptTag = (url) => `<script type="text/javascript" charset="utf-8" src="${url}"></script>`;
let styleTag = (url) => `<link rel="stylesheet" type="text/css" href="${url}" />`;
let buildCurrentJs = (a) => a.current.js.map(scriptTag);
let buildCss = (arr) => arr.map(styleTag).join('\n');
let buildJs = (arr) => arr.map(scriptTag).join('\n');
let buildCurrent = (js, css) => `${buildJs(js)}\n${buildCss(css)}`;
let buildSingle = (template) => (js, css) => template(buildJs(js), buildCss(css));
let fs = require('fs');
let writeHTML = (buildFile) => (fileName) => (source) =>
    fs.writeFileSync(fileName, buildFile(source.js, source.css));

module.exports.buildComponent = writeHTML(buildCurrent);
module.exports.buildSingle = (template) => writeHTML(buildSingle(template));