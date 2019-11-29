import _ from 'lodash';

const stateMap = [
  {
    type: 'nested',
    check: (previous, actual) => _.isObject(previous) && _.isObject(actual),
    handleOptions: (name, previous, actual, builderFn) => ({
      name,
      type: 'nested',
      children: builderFn(previous, actual),
    }),
  },
  {
    type: 'added',
    check: (previous, actual) => _.isUndefined(previous) && !_.isUndefined(actual),
    handleOptions: (name, previous, actual) => ({ name, type: 'added', actual }),
  },
  {
    type: 'deleted',
    check: (previous, actual) => !_.isUndefined(previous) && _.isUndefined(actual),
    handleOptions: (name, previous) => ({ name, type: 'deleted', previous }),
  },
  {
    type: 'changed',
    check: (previous, actual) => !_.isEqual(previous, actual),
    handleOptions: (name, previous, actual) => ({
      name, type: 'changed', previous, actual,
    }),
  },
  {
    type: 'unchanged',
    check: (previous, actual) => _.isEqual(previous, actual),
    handleOptions: (name, previous, actual) => ({
      name, type: 'unchanged', previous, actual,
    }),
  },
];

const buildInternalTree = (previousSettings, actualSettings) => {
  const allProperties = _.union(_.keys(previousSettings), _.keys(actualSettings));
  return allProperties.map((key) => {
    const previous = previousSettings[key];
    const actual = actualSettings[key];
    const { handleOptions } = stateMap.find((stateItem) => stateItem.check(previous, actual));
    return handleOptions(key, previous, actual, buildInternalTree);
  });
};

export default buildInternalTree;
