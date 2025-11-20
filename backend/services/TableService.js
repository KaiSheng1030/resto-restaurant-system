const tables = [
  { id: 1, capacity: 2 },
  { id: 2, capacity: 4 },
  { id: 3, capacity: 4 },
  { id: 4, capacity: 6 },
  { id: 5, capacity: 2 },
];

exports.assignTable = (people) => {
  return tables.find((t) => t.capacity >= people);
};

