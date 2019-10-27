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

const parseSettings = (previousSettings, actualSettings, groupName = '') => {
  const commonNestedProperties = _.union(_.keys(previousSettings), _.keys(actualSettings))
    .filter((key) => (
      _.isObject(previousSettings[key]) && _.isObject(actualSettings[key])
    ));
  const nestedValues = commonNestedProperties.map((key) => (
    parseSettings(previousSettings[key], actualSettings[key], key)
  ));
  const previousSettingsWithoutCommons = _.omit(previousSettings, commonNestedProperties);
  const actualSettingsWithoutCommons = _.omit(actualSettings, commonNestedProperties);
  const transitionDataByPrevious = Object.entries(previousSettingsWithoutCommons).reduce(
    (acc, [key, value]) => _.assign({}, acc, { [key]: { previous: value, actual: null } }),
    [],
  );
  const plainValuesRaw = Object.entries(actualSettingsWithoutCommons)
    .reduce((acc, [key, value]) => {
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
