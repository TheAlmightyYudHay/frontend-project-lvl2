import _ from 'lodash';

const convertValueByType = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const diffRelatedFormats = {
  added: ({ name, actual }, nestingChain) => `Property '${nestingChain}${name}' was added with value: ${convertValueByType(actual)}\n`,
  deleted: ({ name }, nestingChain) => `Property '${nestingChain}${name}' was removed\n`,
  changed: ({ name, actual, previous }, nestingChain) => `Property '${nestingChain}${name}' was updated. From ${convertValueByType(previous)} to ${convertValueByType(actual)}\n`,
  unchanged: () => '',
  nested: (node, nestingChain, handleFn) => `${handleFn(node, `${nestingChain}${node.name}.`)}\n`,
};

const plainFormatter = ({ children }, nestingChain = '') => {
  const childrenFormatted = children.reduce((acc, node) => `${acc}${diffRelatedFormats[node.type](node, nestingChain, plainFormatter)}`, '');
  return _.trimEnd(`${childrenFormatted}`);
};

export default plainFormatter;
