import path from 'path';
// Урок прошел, код сократил, но с помеченными импортами так и не понял, что можно сделать :(
import plainDiff from '../__fixtures__/plainDiff';
import deepDiff from '../__fixtures__/deepDiff';
import deepDiffPlain from '../__fixtures__/deepDiffPlain';
import deepDiffJson from '../__fixtures__/deepDiffJson';
import genDiff from '../src';

const getDiffFixturesPath = (fileTypePrefix, fileExtension) => [
  path.join(__dirname, '..', '/__fixtures__/', `diff1${fileTypePrefix}.${fileExtension}`),
  path.join(__dirname, '..', '/__fixtures__/', `diff2${fileTypePrefix}.${fileExtension}`),
];
const createFormats = (fileTypePrefix, diffFormat, diffExpected) => ['json', 'yaml', 'yml', 'ini'].map((format) => [fileTypePrefix, format, diffFormat, diffExpected]);

test.each([
  ...createFormats('Plain', 'object', plainDiff),
  ...createFormats('Deep', 'object', deepDiff),
  ...createFormats('Deep', 'plain', deepDiffPlain),
  ...createFormats('Deep', 'json', deepDiffJson),
])(
  'should compare two %s %s\'s files in %s format',
  (fileTypePrefix, extension, diffFormat, diffExpected) => {
    const [
      previousSettingsPath, actualSettingsPath,
    ] = getDiffFixturesPath(fileTypePrefix, extension);
    expect(genDiff(previousSettingsPath, actualSettingsPath, diffFormat)).toBe(diffExpected);
  },
);
