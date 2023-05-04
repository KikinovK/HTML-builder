const fs = require('fs');
const path = require('path');

const fileName = 'output.txt';
const pathName = path.join(__dirname, fileName);

const writeStream = fs.createWriteStream(pathName, { flags: 'a' });

const greeting = 'Введите какой нибудь текст(если хотите прекратить ввод, введите `exit`): \n';
const farewell = 'Вввод сохранен в файле output.txt';
const wordExit = 'EXIT';

const exit = () => {
  writeStream.end();
  process.stdout.write(farewell);
  process.exit();
}

process.stdout.write(greeting);

process.on('SIGINT', () => {
 exit();
});

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (data) => {
  const str = data.toString().trim();
  if (str.toUpperCase() === wordExit) {
   exit();
  } else {
    writeStream.write(data);
  }
});

writeStream.on('error', (err) => {
  process.stdout.write(err);
});
