import jsyaml from 'js-yaml';
import ini from 'ini';

const formatsParsers = {
  json: (dataToParse) => JSON.parse(dataToParse),
  yaml: (dataToParse) => jsyaml.safeLoad(dataToParse),
  yml: (dataToParse) => jsyaml.safeLoad(dataToParse),
  ini: (dataToParse) => ini.parse(dataToParse),
};

const chooseParser = (extension) => formatsParsers[extension];

export default (dataToParse, dataType) => {
  const dataParser = chooseParser(dataType);
  return dataParser(dataToParse);
};
