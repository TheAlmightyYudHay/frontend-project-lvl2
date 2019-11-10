import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (name) => path.join(__dirname, '..', '/__fixtures__/', name);

const formats = ['json', 'yaml', 'yml', 'ini'];

describe.each(formats)(
  'should compare two %s\'s files',
  (format) => {
    test.each([['Plain', 'object', 'plainDiff.txt'], ['Deep', 'object', 'deepDiff.txt'], ['Deep', 'plain', 'deepDiffPlain.txt'], ['Deep', 'json', 'deepDiffJson.txt']])(
      'should compare two %s files in %s format',
      (fileTypeSuffix, fileFormat, expectedFixture) => {
        const previousSettings = getFixturePath(`diff1${fileTypeSuffix}.${format}`);
        const actualSettings = getFixturePath(`diff2${fileTypeSuffix}.${format}`);
        const expected = fs.readFileSync(getFixturePath(expectedFixture), 'utf-8').trim();
        expect(genDiff(previousSettings, actualSettings, fileFormat)).toBe(expected);
      },
    );
  },
);
