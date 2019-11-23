import path from 'path';
import fs from 'fs';
import buildInternalTree from './buildInternalTree';
import parseByFormat from './parseByFormat';
import chooseFormatter from './formatters';

const getFileTypeAndData = (filePath) => {
  const fileExtension = path.extname(filePath);
  const fileType = fileExtension.slice(1);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return [fileType, fileData];
};

export default (previousSettingsFilePath, actualSettingsFilePath, formatterType) => {
  const [
    previousFileType, previousFileData,
  ] = getFileTypeAndData(previousSettingsFilePath);
  const [actualFileType, actualFileData] = getFileTypeAndData(actualSettingsFilePath);
  const previousSettingsParsed = parseByFormat(previousFileData, previousFileType);
  const actualSettingsParsed = parseByFormat(actualFileData, actualFileType);
  const transitionData = buildInternalTree(previousSettingsParsed, actualSettingsParsed);
  const formatSettings = chooseFormatter(formatterType);
  return formatSettings(transitionData);
};
