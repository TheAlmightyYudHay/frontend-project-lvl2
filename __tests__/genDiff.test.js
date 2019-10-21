import fs from 'fs';
import plainDiff from './__fixtures__/plainDiff';
import genDiff from '../src/genDiff';

let previousFile;
let actualFile;

beforeAll(() => {
  previousFile = fs.readFileSync(`${__dirname}/__fixtures__/diff1Plain.json`);
  actualFile = fs.readFileSync(`${__dirname}/__fixtures__/diff2Plain.json`);
});

test('should compare two plain JSON\'s', () => {
  expect(genDiff(previousFile, actualFile)).toBe(plainDiff);
});
