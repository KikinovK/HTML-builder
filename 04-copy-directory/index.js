const copyDir = (dirNameIn, dirNameOut) => {
  const fs = require('fs');
  const path = require('path');

  const error = (err) => {
    process.stdout.write(err);
  }

  const pathDirIn = path.join(__dirname, dirNameIn);
  const pathDirOut = path.join(__dirname, dirNameOut);

  fs.rm(pathDirOut, { recursive: true, force: true}, (err) => {
    if (err) { error(err); return };
    fs.mkdir(pathDirOut, { recursive: true }, (err) => {
      if (err) { error(err); return };
      fs.readdir(pathDirIn, (err, files) => {
        if (err) { error(err); return };
        for (const file  of files) {
          const filePathIn= path.join(pathDirIn, file);
          fs.stat(filePathIn, (err, stat) => {
            if (err) { error(err); return };
            if (stat.isFile()) {
              const filePathOut = path.join(pathDirOut, file)
              fs.copyFile(filePathIn, filePathOut, (err) => {
                if (err) { error(err); return };
              })
            }
            if (stat.isDirectory()) {
              const filePathOut = path.join(dirNameOut, file);
              const filePathIn = path.join(dirNameIn, file);
              copyDir(filePathIn, filePathOut);
            }
          });
        }
      });
    });
  });
}

copyDir('files', 'files-copy');
