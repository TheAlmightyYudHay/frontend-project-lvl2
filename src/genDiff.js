import path from 'path';
import fs from 'fs';
import parseSettings from './parseSettings';
import parseFormat from './parseFormat';
import * as formatters from './formatters';

const getFileExtensionAndData = (filePath) => {
  const fileExtension = path.extname(filePath);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return [fileExtension, fileData];
};

export default (previousSettingsFilePath, actualSettingsFilePath, formatterType) => {
  const [
    previousFileExtension, previousFileData,
  ] = getFileExtensionAndData(previousSettingsFilePath);
  const [actualFileExtension, actualFileData] = getFileExtensionAndData(actualSettingsFilePath);
  const previousSettingsParsed = parseFormat(previousFileData, previousFileExtension);
  const actualSettingsParsed = parseFormat(actualFileData, actualFileExtension);
  const transitionData = parseSettings(previousSettingsParsed, actualSettingsParsed);
  const formattingSettingsFiles = formatters[formatterType];
  return formattingSettingsFiles(transitionData);
};
