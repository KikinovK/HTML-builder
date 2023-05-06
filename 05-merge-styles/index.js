const fs = require('fs');
const path = require('path');

const error = (err) => {
  process.stdout.write(err);
}

const fileOut = 'bundle.css';
const dirOut = 'project-dist';
const dirPathOut  = path.join(__dirname, dirOut);
const filePathOut = path.join(__dirname, dirOut, fileOut);
const dirIn = 'styles';
const dirPathIn = path.join(__dirname, dirIn);

fs.mkdir(dirPathOut, { recursive: true }, (err) => {
  if (err) { error(err); return };
  const outputStream = fs.createWriteStream(filePathOut, { flags: 'w' });

  fs.readdir(dirPathIn, (err, files) => {
    if (err) { error(err); return };
    for (const file  of files) {
      const filePathIn = path.join(dirPathIn, file);
      fs.stat(filePathIn, (err, stat) => {
        if (err) { error(err); return };
        if (stat.isFile() && path.extname(filePathIn) === '.css') {
          fs.createReadStream(filePathIn)
            .pipe(outputStream);
        };
      });
    };
  });
});
