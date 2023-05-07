const fs = require('fs');
const path = require('path');

const dirOut = 'project-dist';
const dirPathOut = path.join(__dirname, dirOut);

const fileOut = 'index.html';
const filePathOut = path.join(dirPathOut, fileOut);

const fileStyleOut = 'style.css';
const filePathStyleOut = path.join(dirPathOut, fileStyleOut);

const dirStyleIn = 'styles';
const dirPathStyleIn = path.join(__dirname, dirStyleIn);

const dirAssets = 'assets';
const dirPathAssets = path.join(__dirname, dirAssets);
const dirPathAssetsOut = path.join(__dirname, dirOut, dirAssets);

const fileTemplate = 'template.html';
const filePathTemplate = path.join(__dirname, fileTemplate);

const dirComponents = 'components';
const dirPathComponents = path.join(__dirname, dirComponents);

const error = (err) => {
  process.stdout.write(err);
}

const copyDir = (dirPathIn, dirPathOut) => {
  fs.mkdir(dirPathOut, { recursive: true }, (err) => {
    if (err) { error(err); return };
    fs.readdir(dirPathIn, (err, files) => {
      if (err) { error(err); return };
      for (const file  of files) {
        const filePathIn= path.join(dirPathIn, file);
        fs.stat(filePathIn, (err, stat) => {
          if (err) { error(err); return };
          if (stat.isFile()) {
            const filePathOut = path.join(dirPathOut, file)
            fs.copyFile(filePathIn, filePathOut, (err) => {
              if (err) { error(err); return };
            })
          }
          if (stat.isDirectory()) {
            const filePathOut = path.join(dirPathOut, file);
            const filePathIn = path.join(dirPathIn, file);
            copyDir(filePathIn, filePathOut);
          }
        });
      }
    });
  });
}

const megreFile = (dirPathIn, filePathOut) => {
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
}
fs.rm(dirPathOut, { recursive: true, force: true}, (err) => {
  if (err) { error(err); return };
  fs.mkdir(dirPathOut, { recursive: true }, (err) => {
    if (err) { error(err); return };

    copyDir(dirPathAssets, dirPathAssetsOut);
    megreFile(dirPathStyleIn, filePathStyleOut);

    const readStream = fs.createReadStream(filePathTemplate);
    const writeStream = fs.createWriteStream(filePathOut);
    let body = '';

    readStream.on('data', (chank) => {
      body += chank.toString();
    })

    readStream.on('end', () => {
      const regex = /\{\{.*?\}\}/g;
      const matches = body.match(regex);
      let index = 0;

      for (const match of matches) {
        const nameComponent = match.replace(/[{}]/g, '');
        const filePathComponent = path.join(dirPathComponents, `${nameComponent}.html`);
        const readStrimComponent = fs.createReadStream(filePathComponent);
        let component = '';

        readStrimComponent.on('data', (chank) => {
          component += chank.toString();
        })

        readStrimComponent.on('end', () => {
          body = body.replaceAll(match, component);
          index += 1;
          if (index === matches.length) writeStream.write(body);
        })
      }
    })
  });
});
