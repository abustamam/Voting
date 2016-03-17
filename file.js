var fs = require('fs');
var parse = require('csv-parse');

new Promise((resolve, reject) => {
  var list;
  fs.readFile('./src/data/VREData.csv', 'utf-8', (err, output) => {
  if (err) throw err;
  parse(output, {relax: true, auto_parse: true}, (err, response) => {
    list = response;
    resolve(list);
  });
});
})
.then(result => {
  var splitlist = result.split('\n');
  splitlist.map((row, idx) => {
    fs.writeFile(`./vredatarow${idx}.json`, row, (err) => {
      if (err) throw err;
      console.log(`ROW${idx} complete`);
    })
  })
});
