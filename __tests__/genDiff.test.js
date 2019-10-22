import path from 'path';
import plainDiff from './__fixtures__/plainDiff';
import genDiff from '../src/genDiff';

test('should compare two plain JSON\'s', () => {
  const previousFile = path.join(__dirname, '/__fixtures__/', 'diff1Plain.json');
  const actualFile = path.join(__dirname, '/__fixtures__/', 'diff2Plain.json');
  expect(genDiff(previousFile, actualFile)).toBe(plainDiff);
});

describe('should compare two plain YAML\'s', () => {
  test('should work with .yaml extension', () => {
    const previousFile = path.join(__dirname, '/__fixtures__/', 'diff1Plain.yaml');
    const actualFile = path.join(__dirname, '/__fixtures__/', 'diff2Plain.yaml');
    expect(genDiff(previousFile, actualFile)).toBe(plainDiff);
  });

  test('should work with .yml extension', () => {
    const previousFile = path.join(__dirname, '/__fixtures__/', 'diff1Plain.yml');
    const actualFile = path.join(__dirname, '/__fixtures__/', 'diff2Plain.yml');
    expect(genDiff(previousFile, actualFile)).toBe(plainDiff);
  });
});
