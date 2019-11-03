import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (name) => path.join(__dirname, '..', '/__fixtures__/', name);

const formats = ['json', 'yaml', 'yml', 'ini'];

const deepDiffPlain = fs.readFileSync(getFixturePath('deepDiffPlain.txt'), 'utf-8').trim();
const deepDiffJson = fs.readFileSync(getFixturePath('deepDiffJson.txt'), 'utf-8').trim();
const deepDiff = fs.readFileSync(getFixturePath('deepDiff.txt'), 'utf-8').trim();
const plainDiff = fs.readFileSync(getFixturePath('plainDiff.txt'), 'utf-8').trim();

describe.each(formats)(
  'should compare two %s\'s files',
  (format) => {
    test.each([['Plain', 'object', plainDiff], ['Deep', 'object', deepDiff], ['Deep', 'plain', deepDiffPlain], ['Deep', 'json', deepDiffJson]])(
      'should compare two %s files in %s format',
      (fileTypeSuffix, fileFormat, expected) => {
        const previousSettings = getFixturePath(`diff1${fileTypeSuffix}.${format}`);
        const actualSettings = getFixturePath(`diff2${fileTypeSuffix}.${format}`);
        expect(genDiff(previousSettings, actualSettings, fileFormat)).toBe(expected);
      },
    );
  },
);
