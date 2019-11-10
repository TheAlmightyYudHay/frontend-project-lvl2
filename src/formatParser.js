import jsyaml from 'js-yaml';
import ini from 'ini';

export default (dataToParse, dataType) => {
  const formatsParsers = {
    json: JSON.parse,
    yaml: jsyaml.safeLoad,
    yml: jsyaml.safeLoad,
    ini: ini.parse,
  };
  const dataParser = formatsParsers[dataType];
  return dataParser(dataToParse);
};
