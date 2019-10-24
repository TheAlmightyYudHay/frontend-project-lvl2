import _ from 'lodash';
import parseSettings from './diffParser';
import parseFormat from './formatParser';

const diffRelatedFormats = {
  unchanged: (actual) => `\n${' '.repeat(4)}${actual}`,
  added: (previous, actual) => `\n${' '.repeat(2)}+ ${actual}`,
  deleted: (previous) => `\n${' '.repeat(2)}- ${previous}`,
  changed: (previous, actual) => `\n${' '.repeat(2)}- ${previous}\n${' '.repeat(2)}+ ${actual}`,
};

const stringifyObject = (object) => {
  const entries = Object.entries(object).reduce((acc, [key, value]) => (
    `${acc}${' '.repeat(8)}${key}: ${value}\n`
  ), '\n');
  return `{${entries}${' '.repeat(4)}}`;
};

const convertPropertyDiffToString = ({ name, diffStatus: { previous, actual, state } }) => {
  const [previousFormatted, actualFormatted] = [previous, actual].map((stateValue) => (
    `${name}: ${!_.isNull(stateValue) && _.isObject(stateValue) ? stringifyObject(stateValue) : stateValue}`
  ));
  const formattingMethod = diffRelatedFormats[state];
  return formattingMethod(previousFormatted, actualFormatted);
};

const renderDiff = ({ groupName, nestedValues, plainValues }) => {
  const plainValuesFormatted = plainValues.reduce((acc, diffOptions) => (
    `${acc}${convertPropertyDiffToString(diffOptions)}`
  ), '');
  console.log(plainValuesFormatted);
};

export default (previousFile, actualFile) => {
  const previousFileParsed = parseFormat(previousFile);
  const actualFileParsed = parseFormat(actualFile);
  const transitionData = parseSettings(previousFileParsed, actualFileParsed);
  return renderDiff(transitionData);
};
