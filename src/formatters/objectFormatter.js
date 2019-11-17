import _ from 'lodash';

const prepareValue = (sign, depthOffset) => {
  if (typeof sign !== 'object') return sign;
  const formattedEntries = Object.entries(sign)
    .reduce((acc, [key, value]) => {
      const formattedValue = prepareValue(value, depthOffset + 4);
      return `${acc}${' '.repeat(depthOffset)}${key}: ${formattedValue}\n`;
    }, '');
  return `{\n${_.trimEnd(formattedEntries)}\n${' '.repeat(depthOffset - 4)}}`;
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
  unchanged: ({ name, value }, depthOffset) => `${' '.repeat(depthOffset)}${name}: ${value}\n`,
  added: ({ name, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${actual}\n`,
  deleted: ({ name, previous }, depthOffset) => `${' '.repeat(depthOffset - 2)}- ${name}: ${previous}\n`,
  changed: ({ name, previous, actual }, depthOffset) => `${' '.repeat(depthOffset - 2)}+ ${name}: ${actual}\n${' '.repeat(depthOffset - 2)}- ${name}: ${previous}\n`,
  nested: (node, depthOffset, handleFn) => `${handleFn(node, depthOffset)}\n`,
};

const objectFormatter = ({ name, children }, depthOffset = 0) => {
  const formattedName = name ? `${name}: ` : '';
  const formattedChildren = children.reduce(
    (acc, node) => `${acc}${diffRelatedFormats[node.type](prepareNode(node, depthOffset), depthOffset + 4, objectFormatter)}`,
    '',
  );
  return `${' '.repeat(depthOffset)}${formattedName}{\n${_.trimEnd(formattedChildren)}\n${' '.repeat(depthOffset)}}`;
};

export default objectFormatter;
