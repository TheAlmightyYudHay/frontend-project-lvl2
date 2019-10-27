import jsyaml from 'js-yaml';
import ini from 'ini';

const formatsParsers = {
  '.json': (format) => JSON.parse(format),
  '.yaml': (format) => jsyaml.safeLoad(format),
  '.yml': (format) => jsyaml.safeLoad(format),
  '.ini': (format) => ini.parse(format),
};

const chooseParser = (extension) => formatsParsers[extension];

export default (fileData, fileExtension) => {
  const fileParser = chooseParser(fileExtension);
  return fileParser(fileData);
};
