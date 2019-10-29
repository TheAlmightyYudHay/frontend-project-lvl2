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

const parseSettings = (previousSettings, actualSettings, groupName = '') => {
  const commonProperties = _.intersection(_.keys(previousSettings), _.keys(actualSettings));
  const commonNestedProperties = commonProperties.filter((key) => (
    _.isObject(previousSettings[key]) && _.isObject(actualSettings[key])
  ));
  const nestedValues = commonNestedProperties.map((key) => (
    parseSettings(previousSettings[key], actualSettings[key], key)
  ));
  const allProperties = _.union(_.keys(previousSettings), _.keys(actualSettings));
  const plainProperties = _.difference(allProperties, commonNestedProperties);
  const plainValues = plainProperties.map((key) => {
    const previous = previousSettings[key];
    const actual = actualSettings[key];
    const { stateHandle } = stateMap.find((stateItem) => stateItem.check(previous, actual));
    const diffStatus = stateHandle(previous, actual);
    return { name: key, diffStatus };
  });
  return { groupName, nestedValues, plainValues };
};

export default parseSettings;
