import path from 'path';
import fs from 'fs';
import internalTreeBuilder from './internalTreeBuilder';
import parseFormat from './formatParser';
import * as formatters from './formatters';

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
  const previousSettingsParsed = parseFormat(previousFileData, previousFileType);
  const actualSettingsParsed = parseFormat(actualFileData, actualFileType);
  const transitionData = internalTreeBuilder(previousSettingsParsed, actualSettingsParsed);
  const formattingSettingsFiles = formatters[formatterType];
  return formattingSettingsFiles(transitionData);
};
