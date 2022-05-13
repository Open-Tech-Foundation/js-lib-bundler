/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const { mkdirSync, writeFileSync, existsSync } = require('fs');

function jsonToFiles(path, obj) {
  mkdirSync(path, { recursive: true });
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        const filePath = join(path, key);
        writeFileSync(filePath, value);
      }
      if (typeof value === 'object') {
        const dirPath = join(path, key);
        mkdirSync(dirPath, { recursive: true });
        jsonToFiles(dirPath, value);
      }
    }
  }
}

module.exports = jsonToFiles;
