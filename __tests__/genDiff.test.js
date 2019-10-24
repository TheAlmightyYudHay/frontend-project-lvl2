import path from 'path';
import plainDiff from './__fixtures__/plainDiff';
import deepDiff from './__fixtures__/deepDiff';
import genDiff from '../src/genDiff';

test.each([['json'], ['yaml'], ['yml'], ['ini']])(
  'should compare two plain %s\'s files',
  (extension) => {
    const previousFile = path.join(__dirname, '/__fixtures__/', `diff1Plain.${extension}`);
    const actualFile = path.join(__dirname, '/__fixtures__/', `diff2Plain.${extension}`);
    expect(genDiff(previousFile, actualFile)).toBe(plainDiff);
  },
);

test.each([['json']/* , ['yaml'], ['yml'], ['ini'] */])(
  'should compare two nested %s\'s files',
  (extension) => {
    const previousFile = path.join(__dirname, '/__fixtures__/', `diff1Deep.${extension}`);
    const actualFile = path.join(__dirname, '/__fixtures__/', `diff2Deep.${extension}`);
    expect(genDiff(previousFile, actualFile)).toBe(deepDiff);
  },
);
