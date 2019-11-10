import _ from 'lodash';

const stateMap = [
  {
    check: (previous, actual) => _.isUndefined(previous) && !_.isUndefined(actual),
    stateHandle: (previous, actual) => ({ actual, state: 'added' }),
  },
  {
    check: (previous, actual) => !_.isUndefined(previous) && _.isUndefined(actual),
    stateHandle: (previous) => ({ previous, state: 'deleted' }),
  },
  {
    check: (previous, actual) => !_.isEqual(previous, actual),
    stateHandle: (previous, actual) => ({ previous, actual, state: 'changed' }),
  },
  {
    check: (previous, actual) => _.isEqual(previous, actual),
    stateHandle: (previous) => ({ value: previous, state: 'unchanged' }),
  },
];

const internalTreeBuilder = (previousSettings, actualSettings, groupName = '') => {
  const allProperties = _.union(_.keys(previousSettings), _.keys(actualSettings));
  const [nestedValues, plainValues] = allProperties.reduce(([nested, plain], key) => {
    const previous = previousSettings[key];
    const actual = actualSettings[key];
    if (_.isObject(previous) && _.isObject(actual)) {
      return [[...nested, internalTreeBuilder(previous, actual, key)], plain];
    }
    const { stateHandle } = stateMap.find((stateItem) => stateItem.check(previous, actual));
    const diffStatus = stateHandle(previous, actual);
    return [nested, [...plain, { name: key, diffStatus }]];
  }, [[], []]);
  return { groupName, nestedValues, plainValues };
};

export default internalTreeBuilder;
