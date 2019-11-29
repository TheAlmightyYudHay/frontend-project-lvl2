const stringify = (property, treeDepth) => {
  if (typeof property !== 'object') return property;
  const formattedEntries = Object.entries(property)
    .map(([key, value]) => {
      const formattedValue = stringify(value, treeDepth + 1);
      return `${' '.repeat(treeDepth * 4)}${key}: ${formattedValue}`;
    })
    .join('\n');
  return `{\n${formattedEntries}\n${' '.repeat((treeDepth - 1) * 4)}}`;
};

const buildLine = (name, value, treeDepth, sign) => {
  const prefix = sign ? `${' '.repeat(treeDepth * 4 - 2)}${sign} ` : `${' '.repeat(treeDepth * 4)}`;
  return `${prefix}${name}: ${stringify(value, treeDepth + 1)}`;
};

const diffRelatedFormats = {
  unchanged: ({ name, actual }, treeDepth) => buildLine(name, actual, treeDepth, null),
  added: ({ name, actual }, treeDepth) => buildLine(name, actual, treeDepth, '+'),
  deleted: ({ name, previous }, treeDepth) => buildLine(name, previous, treeDepth, '-'),
  changed: ({ name, previous, actual }, treeDepth) => `${buildLine(name, actual, treeDepth, '+')}\n${buildLine(name, previous, treeDepth, '-')}`,
  nested: ({ name, children }, treeDepth, handleFn) => `${' '.repeat(treeDepth * 4)}${name}: {\n${handleFn(children, treeDepth)}\n${' '.repeat(treeDepth * 4)}}`,
};

const formatAsObject = (nodes, treeDepth = 0) => nodes.map(
  (child) => diffRelatedFormats[child.type](child, treeDepth + 1, formatAsObject),
).join('\n');

export default (nodes) => `{\n${formatAsObject(nodes)}\n}`;
