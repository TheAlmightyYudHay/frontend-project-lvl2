import path from 'path';
import plainDiff from './__fixtures__/plainDiff';
import deepDiff from './__fixtures__/deepDiff';
import deepDiffPlain from './__fixtures__/deepDiffPlain';
import genDiff from '../src/genDiff';

test.each([['json'], ['yaml'], ['yml'], ['ini']])(
  'should compare two plain %s\'s files',
  (extension) => {
    const previousSettings = path.join(__dirname, '/__fixtures__/', `diff1Plain.${extension}`);
    const actualSettings = path.join(__dirname, '/__fixtures__/', `diff2Plain.${extension}`);
    expect(genDiff(previousSettings, actualSettings, 'json')).toBe(plainDiff);
  },
);

test.each([['json'], ['yaml'], ['yml'], ['ini']])(
  'should compare two nested %s\'s files',
  (extension) => {
    const previousSettings = path.join(__dirname, '/__fixtures__/', `diff1Deep.${extension}`);
    const actualSettings = path.join(__dirname, '/__fixtures__/', `diff2Deep.${extension}`);
    expect(genDiff(previousSettings, actualSettings, 'json')).toBe(deepDiff);
  },
);

test.each([['json'], ['yaml'], ['yml'], ['ini']])(
  'should compare two nested %s\'s files in plain format',
  (extension) => {
    const previousSettings = path.join(__dirname, '/__fixtures__/', `diff1Deep.${extension}`);
    const actualSettings = path.join(__dirname, '/__fixtures__/', `diff2Deep.${extension}`);
    expect(genDiff(previousSettings, actualSettings, 'plain')).toBe(deepDiffPlain);
  },
);
