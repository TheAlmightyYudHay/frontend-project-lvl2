const convertValueByType = (value) => {
  if (typeof value === 'object') return '[complex value]';
  if (typeof value === 'string') return `'${value}'`;
  return value;
};

const diffRelatedFormats = {
  added: ({ name, actual }, ancestry) => `Property '${ancestry}${name}' was added with value: ${convertValueByType(actual)}`,
  deleted: ({ name }, ancestry) => `Property '${ancestry}${name}' was removed`,
  changed: ({ name, actual, previous }, ancestry) => `Property '${ancestry}${name}' was updated. From ${convertValueByType(previous)} to ${convertValueByType(actual)}`,
  unchanged: () => null,
  nested: ({ name, children }, ancestry, handleFn) => `${handleFn(children, `${ancestry}${name}.`)}`,
};

const formatAsPlain = (nodes, ancestry = '') => nodes
  .map((node) => diffRelatedFormats[node.type](node, ancestry, formatAsPlain))
  .filter((v) => v !== null)
  .join('\n');

export default formatAsPlain;
