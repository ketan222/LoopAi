const PRIORITY_VALUES = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const getPriorityValue = (priority) => {
  return PRIORITY_VALUES[priority] || 0;
};

const comparePriorities = (a, b) => {
  return getPriorityValue(b) - getPriorityValue(a);
};

module.exports = {
  getPriorityValue,
  comparePriorities,
};
