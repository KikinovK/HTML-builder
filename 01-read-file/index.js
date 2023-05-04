const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const pathName = path.join(__dirname, fileName);

const readStream = fs.createReadStream(pathName);

readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

readStream.on('error', (err) => {
  process.stdout.write(err);
});
