import _ from 'lodash';
import parseFormat from './parsers';

const parseFilesData = (previousFile, actualFile) => {
  const previousFileProcessed = Object.entries(previousFile)
    .reduce(
      (acc, [key, value]) => _.assign({}, acc, { [key]: { previous: value, actual: null } }),
      {},
    );
  return Object.entries(actualFile)
    .reduce((acc, [key, value]) => {
      const previous = _.has(acc, key) ? acc[key].previous : null;
      return _.assign({}, acc, { [key]: { actual: value, previous } });
    }, previousFileProcessed);
};

const convertPropertyDiffToString = (name, previous, actual) => {
  if (previous === actual) return `    ${name}: ${actual}\n`;
  const previousDiffLine = previous === null ? '' : `  - ${name}: ${previous}\n`;
  const actualDiffLine = actual === null ? '' : `  + ${name}: ${actual}\n`;
  return `${actualDiffLine}${previousDiffLine}`;
};

const renderDiff = (abstractTree) => {
  const diffsList = Object.entries(abstractTree).reduce((acc, [name, { previous, actual }]) => {
    const propertyDiff = convertPropertyDiffToString(name, previous, actual);
    return `${acc}${propertyDiff}`;
  }, '');
  return `{\n${diffsList}}`;
};

export default (previousFile, actualFile) => {
  const previousFileParsed = parseFormat(previousFile);
  const actualFileParsed = parseFormat(actualFile);
  const transitionData = parseFilesData(previousFileParsed, actualFileParsed);
  return renderDiff(transitionData);
};
