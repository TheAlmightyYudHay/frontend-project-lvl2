import path from 'path';
import fs from 'fs';
import jsyaml from 'js-yaml';
import ini from 'ini';

const chooseParser = (extension) => {
  const formatsParsers = {
    '.json': (format) => JSON.parse(format),
    '.yaml': (format) => jsyaml.safeLoad(format),
    '.yml': (format) => jsyaml.safeLoad(format),
    '.ini': (format) => ini.parse(format),
  };
  return formatsParsers[extension];
};

export default (filePath) => {
  const fileExtension = path.extname(filePath);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const fileParser = chooseParser(fileExtension);
  if (fileExtension === '.ini') console.log(fileData);
  return fileParser(fileData);
};
