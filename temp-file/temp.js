const fs = require('fs').promises;

console.log("test");

fs.readFile('package.json')
  .then(data => console.log(data.toString()))
  .catch(err => console.log(err.message));

fs.readdir(__dirname)
  .then(files => {
    return Promise.all(
      files.map(async filename => {
        const stats = await fs.stat(filename);
        return {
          Name: filename,
          Size: stats.size,
          Date: stats.mtime,
        };
      }),
    );
  })
  .then(result => console.table(result));
  