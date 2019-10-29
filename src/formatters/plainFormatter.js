import _ from 'lodash';

const diffRelatedFormats = {
  added: (name, nestingChain, { actual }) => `Property '${nestingChain}${name}' was added with value: ${actual}`,
  deleted: (name, nestingChain) => `Property '${nestingChain}${name}' was removed`,
  changed: (name, nestingChain, { actual, previous }) => `Property '${nestingChain}${name}' was updated. From ${previous} to ${actual}`,
};

const typeMapping = [
  {
    converting: (value) => value,
    check: (value) => typeof value === 'number',
  },
  {
    converting: (value) => `'${value}'`,
    check: (value) => typeof value === 'string',
  },
  {
    converting: () => '[complex value]',
    check: (value) => typeof value === 'object',
  },
  {
    converting: (value) => value,
    check: (value) => typeof value === 'boolean',
  },
];

const convertValueByType = (value) => {
  const { converting } = typeMapping.find(({ check }) => check(value));
  return converting(value);
};

const convertPropertyDiffToString = (
  { name, diffStatus: { state, ...restDiffOptions } }, nestingChain,
) => {
  const restDiffOptionsFormatted = Object.entries(restDiffOptions).reduce((acc, [key, value]) => (
    { ...acc, [key]: convertValueByType(value) }
  ), {});
  const formattingMethod = diffRelatedFormats[state];
  return formattingMethod(name, nestingChain, restDiffOptionsFormatted);
};

const plainFormatter = ({ nestedValues, plainValues }, nestingChain = '') => {
  const plainValuesWithoutUnchanged = plainValues.filter(({ diffStatus: { state } }) => state !== 'unchanged');
  const plainValuesFormatted = plainValuesWithoutUnchanged.reduce((acc, diffOptions) => `${acc}${convertPropertyDiffToString(diffOptions, nestingChain)}\n`, '');
  const nestedValuesFormatted = nestedValues.reduce((acc, nestedItem) => {
    const { groupName } = nestedItem;
    const newNestingChain = nestingChain === '' ? `${groupName}.` : `${nestingChain}${groupName}.`;
    return `${acc}${plainFormatter(nestedItem, `${newNestingChain}`)}\n`;
  }, '');
  return _.trimEnd(`${nestedValuesFormatted}${plainValuesFormatted}`);
};

export default plainFormatter;
