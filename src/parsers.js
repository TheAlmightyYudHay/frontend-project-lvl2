import path from 'path';
import fs from 'fs';
import jsyaml from 'js-yaml';

const chooseParser = (extension) => {
  const formatsParsers = {
    '.json': (format) => JSON.parse(format),
    '.yaml': (format) => jsyaml.safeLoad(format),
    '.yml': (format) => jsyaml.safeLoad(format),
  };
  return formatsParsers[extension];
};

export default (filePath) => {
  const fileExtension = path.extname(filePath);
  const fileData = fs.readFileSync(filePath);
  const fileParser = chooseParser(fileExtension);
  return fileParser(fileData);
};
