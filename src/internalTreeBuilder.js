import _ from 'lodash';

const stateMap = [
  {
    type: 'nested',
    check: (previous, actual) => _.isObject(previous) && _.isObject(actual),
    handleOptions: (previous, actual, builderFn) => builderFn(previous, actual),
  },
  {
    type: 'added',
    check: (previous, actual) => _.isUndefined(previous) && !_.isUndefined(actual),
    handleOptions: (previous, actual) => ({ actual }),
  },
  {
    type: 'deleted',
    check: (previous, actual) => !_.isUndefined(previous) && _.isUndefined(actual),
    handleOptions: (previous) => ({ previous }),
  },
  {
    type: 'changed',
    check: (previous, actual) => !_.isEqual(previous, actual),
    handleOptions: (previous, actual) => ({ previous, actual }),
  },
  {
    type: 'unchanged',
    check: (previous, actual) => _.isEqual(previous, actual),
    handleOptions: (previous) => ({ value: previous }),
  },
];

const internalTreeBuilder = (previousSettings, actualSettings) => {
  const allProperties = _.union(_.keys(previousSettings), _.keys(actualSettings));
  const children = allProperties.map((key) => {
    const previous = previousSettings[key];
    const actual = actualSettings[key];
    const { handleOptions, type } = stateMap.find((stateItem) => stateItem.check(previous, actual));
    return { name: key, type, ...handleOptions(previous, actual, internalTreeBuilder) };
  });
  return { type: 'nested', children };
};

export default internalTreeBuilder;
