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
  unchanged: ({ name, value: { actual } }, treeDepth) => buildLine(name, actual, treeDepth, null),
  added: ({ name, value: { actual } }, treeDepth) => buildLine(name, actual, treeDepth, '+'),
  deleted: ({ name, value: { previous } }, treeDepth) => buildLine(name, previous, treeDepth, '-'),
  changed: ({ name, value: { previous, actual } }, treeDepth) => `${buildLine(name, actual, treeDepth, '+')}\n${buildLine(name, previous, treeDepth, '-')}`,
  nested: (node, treeDepth, handleFn) => handleFn(node, treeDepth),
};

const formatAsObject = (node, treeDepth = 0) => {
  const { name, children } = node;
  const formattedName = name ? `${name}: ` : '';
  const formattedChildren = children.map((child) => diffRelatedFormats[child.type](
    child, treeDepth + 1, formatAsObject,
  ))
    .join('\n');
  return `${' '.repeat(treeDepth * 4)}${formattedName}{\n${formattedChildren}\n${' '.repeat(treeDepth * 4)}}`;
};

export default formatAsObject;
