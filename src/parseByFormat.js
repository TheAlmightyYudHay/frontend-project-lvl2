import jsyaml from 'js-yaml';
import ini from 'ini';

const formatsParsers = {
  json: JSON.parse,
  yaml: jsyaml.safeLoad,
  yml: jsyaml.safeLoad,
  ini: ini.parse,
};

export default (dataToParse, dataType) => {
  const dataParser = formatsParsers[dataType];
  return dataParser(dataToParse);
};
