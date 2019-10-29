import _ from 'lodash';

const diffRelatedFormats = {
  unchanged: ({ value }, depthOffset) => `\n${' '.repeat(depthOffset)}${value}`,
  added: ({ actual }, depthOffset) => `\n${' '.repeat(depthOffset - 2)}+ ${actual}`,
  deleted: ({ previous }, depthOffset) => `\n${' '.repeat(depthOffset - 2)}- ${previous}`,
  changed: ({ previous, actual }, depthOffset) => `\n${' '.repeat(depthOffset - 2)}+ ${actual}\n${' '.repeat(depthOffset - 2)}- ${previous}`,
};

const stringifyObject = (object, depthOffset) => {
  const entries = Object.entries(object).reduce((acc, [key, value]) => (
    `${acc}${' '.repeat(depthOffset + 4)}${key}: ${!_.isNull(value) && _.isObject(value) ? stringifyObject(value, depthOffset + 4) : value}\n`
  ), '\n');
  return `{${entries}${' '.repeat(depthOffset)}}`;
};

const convertPropertyDiffToString = (
  { name, diffStatus: { state, ...restDiffOptions } }, depthOffset,
) => {
  const restDiffOptionsFormatted = Object.entries(restDiffOptions)
    .reduce((acc, [key, value]) => {
      const formattedValue = `${name}: ${!_.isNull(value) && _.isObject(value) ? stringifyObject(value, depthOffset) : value}`;
      return { ...acc, [key]: formattedValue };
    }, {});
  const formattingMethod = diffRelatedFormats[state];
  return formattingMethod(restDiffOptionsFormatted, depthOffset);
};

const objectFormatter = ({ groupName, nestedValues, plainValues }, depthOffset = 4) => {
  const plainValuesFormatted = plainValues.reduce((acc, diffOptions) => (
    `${acc}${convertPropertyDiffToString(diffOptions, depthOffset)}`
  ), '');
  const nestedValuesFormatted = nestedValues.reduce((acc, nestedSettingsChild) => `${acc}\n${' '.repeat(depthOffset)}${objectFormatter(nestedSettingsChild, depthOffset + 4)}`, '');
  const groupNameFormatted = groupName === '' ? groupName : `${groupName}: `;
  return `${groupNameFormatted}{${nestedValuesFormatted}${plainValuesFormatted}\n${' '.repeat(depthOffset - 4)}}`;
};

export default objectFormatter;
