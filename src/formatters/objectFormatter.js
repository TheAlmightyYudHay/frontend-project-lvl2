const prepareValue = (sign, depthOffset) => {
  if (typeof sign !== 'object') return sign;
  const formattedEntries = Object.entries(sign)
    .map(([key, value]) => {
      const formattedValue = prepareValue(value, depthOffset + 4);
      return `${' '.repeat(depthOffset)}${key}: ${formattedValue}`;
    })
    .join('\n');
  return `{\n${formattedEntries}\n${' '.repeat(depthOffset - 4)}}`;
};

const prepareNode = ({
  name, type, children, ...rest
}, depthOffset) => {
  const preparedValues = Object.entries(rest)
    .reduce((acc, [key, value]) => (
      { ...acc, [key]: prepareValue(value, depthOffset + 8) }
    ), {});
  return {
    name, type, children, ...preparedValues,
  };
};

const diffRelatedFormats = {
  unchanged: ({ name, value }, depthOffset) => `${' '.repeat(depthOffset)}${name}: ${value}`,
  added: ({ name, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${actual}`,
  deleted: ({ name, previous }, depthOffset) => `${' '.repeat(depthOffset - 2)}- ${name}: ${previous}`,
  changed: ({ name, previous, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${actual}\n${' '.repeat(depthOffset - 2)}- ${name}: ${previous}`,
  nested: (node, depthOffset, handleFn) => handleFn(node, depthOffset),
};

const objectFormatter = ({ name, children }, depthOffset = 0) => {
  const formattedName = name ? `${name}: ` : '';
  const formattedChildren = children.map((node) => diffRelatedFormats[node.type](
    prepareNode(node, depthOffset), depthOffset + 4, objectFormatter,
  ))
    .join('\n');
  return `${' '.repeat(depthOffset)}${formattedName}{\n${formattedChildren}\n${' '.repeat(depthOffset)}}`;
};

export default objectFormatter;
