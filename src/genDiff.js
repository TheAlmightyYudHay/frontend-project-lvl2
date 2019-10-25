import parseSettings from './diffParser';
import parseFormat from './formatParser';
import renderAsJson from './renderAsJson';

export default (previousFile, actualFile) => {
  const previousFileParsed = parseFormat(previousFile);
  const actualFileParsed = parseFormat(actualFile);
  const transitionData = parseSettings(previousFileParsed, actualFileParsed);
  return renderAsJson(transitionData);
};
