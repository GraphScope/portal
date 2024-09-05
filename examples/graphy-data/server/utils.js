const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const queryLocalFile = async filename => {
  const filePath = path.resolve(__dirname, 'data/raw', filename);

  // 检查文件是否存在
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch (err) {
    console.error('File does not exist:', filePath);
    return [];
  }

  // 检查文件类型
  const fileExtension = path.extname(filePath).toLowerCase();
  if (fileExtension === '.csv') {
    return parseCsvFile(filePath, filename);
  } else if (fileExtension === '.json') {
    return readJsonFile(filePath);
  } else {
    console.error('Unsupported file type:', fileExtension);
    return [];
  }
};

const parseCsvFile = (filePath, filename) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: '|' }))
      .on('data', row => {
        return results.push({ ...row, label: filename, properties: row });
      })
      .on('end', () => resolve(results))
      .on('error', err => {
        console.error('CSV parsing error:', err);
        reject([]);
      });
  });
};

const readJsonFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        reject([]);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          console.error('JSON parsing error:', parseErr);
          reject([]);
        }
      }
    });
  });
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
module.exports = { queryLocalFile, readJsonFile, uuid };
