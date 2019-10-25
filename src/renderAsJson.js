import _ from 'lodash';

const diffRelatedFormats = {
  unchanged: (previous, actual, depthOffset) => `\n${' '.repeat(depthOffset)}${actual}`,
  added: (previous, actual, depthOffset) => `\n${' '.repeat(depthOffset - 2)}+ ${actual}`,
  deleted: (previous, actual, depthOffset) => `\n${' '.repeat(depthOffset - 2)}- ${previous}`,
  changed: (previous, actual, depthOffset) => `\n${' '.repeat(depthOffset - 2)}+ ${actual}\n${' '.repeat(depthOffset - 2)}- ${previous}`,
};

const stringifyObject = (object, depthOffset) => {
  const entries = Object.entries(object).reduce((acc, [key, value]) => (
    `${acc}${' '.repeat(depthOffset + 4)}${key}: ${!_.isNull(value) && _.isObject(value) ? stringifyObject(value, depthOffset + 4) : value}\n`
  ), '\n');
  return `{${entries}${' '.repeat(depthOffset)}}`;
};

const convertPropertyDiffToString = (
  { name, diffStatus: { previous, actual, state } }, depthOffset,
) => {
  const [previousFormatted, actualFormatted] = [previous, actual].map((stateValue) => (
    `${name}: ${!_.isNull(stateValue) && _.isObject(stateValue) ? stringifyObject(stateValue, depthOffset) : stateValue}`
  ));
  const formattingMethod = diffRelatedFormats[state];
  return formattingMethod(previousFormatted, actualFormatted, depthOffset);
};

const renderAsJson = ({ groupName, nestedValues, plainValues }, depthOffset = 4) => {
  const plainValuesFormatted = plainValues.reduce((acc, diffOptions) => (
    `${acc}${convertPropertyDiffToString(diffOptions, depthOffset)}`
  ), '');
  const nestedValuesFormatted = nestedValues.reduce((acc, nestedSettingsChild) => `${acc}\n${' '.repeat(depthOffset)}${renderAsJson(nestedSettingsChild, depthOffset + 4)}`, '');
  const groupNameFormatted = _.isNull(groupName) ? '' : `${groupName}: `;
  return `${groupNameFormatted}{${nestedValuesFormatted}${plainValuesFormatted}\n${' '.repeat(depthOffset - 4)}}`;
};

export default renderAsJson;
