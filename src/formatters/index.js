import formatAsObject from './formatAsObject';
import formatAsPlain from './formatAsPlain';
import jsonFormatter from './formatAsJson';

const formatters = {
  object: formatAsObject,
  json: jsonFormatter,
  plain: formatAsPlain,
};

export default (formatterType) => formatters[formatterType];
