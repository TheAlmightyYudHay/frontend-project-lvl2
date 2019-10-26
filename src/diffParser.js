import _ from 'lodash';

const stateMap = [
  {
    name: 'added',
    check: (previous, actual) => _.isNull(previous) && !_.isNull(actual),
  },
  {
    name: 'deleted',
    check: (previous, actual) => !_.isNull(previous) && _.isNull(actual),
  },
  {
    name: 'changed',
    check: (previous, actual) => !_.isEqual(previous, actual),
  },
  {
    name: 'unchanged',
    check: (previous, actual) => _.isEqual(previous, actual),
  },
];

const parseSettings = (previousFile, actualFile, groupName = null) => {
  const commonNestedProperties = _.union(_.keys(previousFile), _.keys(actualFile)).filter((key) => (
    _.isObject(previousFile[key]) && _.isObject(actualFile[key])
  ));
  const nestedValues = commonNestedProperties.map((key) => (
    parseSettings(previousFile[key], actualFile[key], key)
  ));
  const previousFileWithoutCommons = _.omit(previousFile, commonNestedProperties);
  const actualFileWithoutCommons = _.omit(actualFile, commonNestedProperties);
  const transitionDataByPrevious = Object.entries(previousFileWithoutCommons).reduce(
    (acc, [key, value]) => _.assign({}, acc, { [key]: { previous: value, actual: null } }),
    [],
  );
  const plainValuesRaw = Object.entries(actualFileWithoutCommons).reduce((acc, [key, value]) => {
    const previous = _.has(acc, key) ? acc[key].previous : null;
    return _.assign({}, acc, { [key]: { previous, actual: value } });
  }, transitionDataByPrevious);
  const plainValues = Object.entries(plainValuesRaw).map(([key, { previous, actual }]) => {
    const state = stateMap.find((stateItem) => stateItem.check(previous, actual)).name;
    return { name: key, diffStatus: { previous, actual, state } };
  });
  return { groupName, nestedValues, plainValues };
};

export default parseSettings;
