const stringify = (property, depthOffset) => {
  if (typeof property !== 'object') return property;
  const formattedEntries = Object.entries(property)
    .map(([key, value]) => {
      const formattedValue = stringify(value, depthOffset + 4);
      return `${' '.repeat(depthOffset)}${key}: ${formattedValue}`;
    })
    .join('\n');
  return `{\n${formattedEntries}\n${' '.repeat(depthOffset - 4)}}`;
};

const buildLine = (name, value, depthOffset, sign) => {
  const prefix = sign ? `${' '.repeat(depthOffset - 2)}${sign} ` : `${' '.repeat(depthOffset)}`;
  return `${prefix}${name}: ${stringify(value, depthOffset + 4)}`;
};

const diffRelatedFormats = {
  unchanged: ({ name, actual }, depthOffset) => buildLine(name, actual, depthOffset, null),
  added: ({ name, actual }, depthOffset) => buildLine(name, actual, depthOffset, '+'),
  deleted: ({ name, previous }, depthOffset) => buildLine(name, previous, depthOffset, '-'),
  changed: ({ name, previous, actual }, depthOffset) => `${buildLine(name, actual, depthOffset, '+')}\n${buildLine(name, previous, depthOffset, '-')}`,
  nested: (node, depthOffset, handleFn) => handleFn(node, depthOffset),
};

const formatAsObject = (node, depthOffset = 0) => {
  const { name, children } = node;
  const formattedName = name ? `${name}: ` : '';
  const formattedChildren = children.map((child) => diffRelatedFormats[child.type](
    child, depthOffset + 4, formatAsObject,
  ))
    .join('\n');
  return `${' '.repeat(depthOffset)}${formattedName}{\n${formattedChildren}\n${' '.repeat(depthOffset)}}`;
};

export default formatAsObject;
