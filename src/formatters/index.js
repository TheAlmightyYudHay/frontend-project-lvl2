import objectFormatter from './objectFormatter';
import plainFormatter from './plainFormatter';
import jsonFormatter from './jsonFormatter';

const formatters = {
  object: objectFormatter,
  json: jsonFormatter,
  plain: plainFormatter,
};

export default (formatterType) => formatters[formatterType];
