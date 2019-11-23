const stringify = (sign, depthOffset) => {
  if (typeof sign !== 'object') return sign;
  const formattedEntries = Object.entries(sign)
    .map(([key, value]) => {
      const formattedValue = stringify(value, depthOffset + 4);
      return `${' '.repeat(depthOffset)}${key}: ${formattedValue}`;
    })
    .join('\n');
  return `{\n${formattedEntries}\n${' '.repeat(depthOffset - 4)}}`;
};

const diffRelatedFormats = {
  unchanged: ({ name, actual }, depthOffset) => `${' '.repeat(depthOffset)}${name}: ${stringify(actual, depthOffset + 4)}`,
  added: ({ name, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${stringify(actual, depthOffset + 4)}`,
  deleted: ({ name, previous }, depthOffset) => `${' '.repeat(depthOffset - 2)}- ${name}: ${stringify(previous, depthOffset + 4)}`,
  changed: ({ name, previous, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${stringify(actual, depthOffset + 4)}\n${' '.repeat(depthOffset - 2)}- ${name}: ${stringify(previous, depthOffset + 4)}`,
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
