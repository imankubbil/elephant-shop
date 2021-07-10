const fs = require('fs');

const modules = [];

fs.readdirSync(__dirname).forEach((folderOrFile) => {
  if(folderOrFile !== "index.js") {
    let apiModule = require(`./${folderOrFile}`);
    if(apiModule.default) {
      apiModule = apiModule.default;
    }

    modules.push(apiModule);
  }
});

module.exports = modules;