const convertValueByType = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const diffRelatedFormats = {
  added: ({ name, actual }, nestingChain) => `Property '${nestingChain}${name}' was added with value: ${convertValueByType(actual)}`,
  deleted: ({ name }, nestingChain) => `Property '${nestingChain}${name}' was removed`,
  changed: ({ name, actual, previous }, nestingChain) => `Property '${nestingChain}${name}' was updated. From ${convertValueByType(previous)} to ${convertValueByType(actual)}`,
  unchanged: () => null,
  nested: (node, nestingChain, handleFn) => `${handleFn(node, `${nestingChain}${node.name}.`)}`,
};

const plainFormatter = ({ children }, nestingChain = '') => children
  .map((node) => diffRelatedFormats[node.type](node, nestingChain, plainFormatter))
  .filter((v) => v !== null)
  .join('\n');

export default plainFormatter;
