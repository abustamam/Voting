var fs = require('fs');
var parse = require('csv-parse');
var list;
fs.readFile('./src/data/VREData.csv', 'utf-8', (err, output) => {
  if (err) throw err;
  parse(output, {columns: true, relax: false}, (err, response) => {
    list = response;
    fs.writeFile(`./src/data/vredataset.json`, JSON.stringify(list, null, 2)
                 .replace(/\"{\\\"Categories\\\":/g, '{"Categories":')
                 .replace(/\}\]\}\]\}\]\}\"/g, '}]}]}]}')
                 .replace(/\\\"/g, '"')
                 .replace(/\\\\\"/g, '\\\"')
    , (err) => {
      if (err) throw err;
      console.log(`complete`);
    })
  });
});
