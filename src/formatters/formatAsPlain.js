const convertValueByType = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const diffRelatedFormats = {
  added: ({ name, value: { actual } }, ancestry) => `Property '${ancestry}${name}' was added with value: ${convertValueByType(actual)}`,
  deleted: ({ name }, ancestry) => `Property '${ancestry}${name}' was removed`,
  changed: ({ name, value: { actual, previous } }, ancestry) => `Property '${ancestry}${name}' was updated. From ${convertValueByType(previous)} to ${convertValueByType(actual)}`,
  unchanged: () => null,
  nested: (node, ancestry, handleFn) => `${handleFn(node, `${ancestry}${node.name}.`)}`,
};

const formatAsPlain = ({ children }, ancestry = '') => children
  .map((node) => diffRelatedFormats[node.type](node, ancestry, formatAsPlain))
  .filter((v) => v !== null)
  .join('\n');

export default formatAsPlain;
