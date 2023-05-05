const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const pathName = path.join(__dirname, folderName);


fs.readdir(pathName, (err, files) => {
  if (err) {
    process.stdout.write(err);
    return;
  }

  for(const file of files) {
    const filePath = path.join(pathName, file);
    fs.stat(filePath, (err, stat) => {
      if (err) {
        process.stdout.write(err);
        return;
      }

      if (stat.isFile()) {
        const info = [];
        const fileExtension = path.extname(filePath) ? path.extname(filePath).slice(1) : '   ';
        const fileName = path.basename(filePath, path.extname(filePath));
        const fileSize = `${stat.size / 1000}kb`;
        info.push(fileName);
        info.push(fileExtension);
        info.push(fileSize);
        process.stdout.write(info.join(' - ') + '\n');
      }
    })
  }
});
