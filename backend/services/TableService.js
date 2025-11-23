const fs = require("fs");
const path = require("path");

const tablesPath = path.join(__dirname, "../tables.json");

function loadTables() {
  return JSON.parse(fs.readFileSync(tablesPath, "utf8"));
}

function saveTables(data) {
  fs.writeFileSync(tablesPath, JSON.stringify(data, null, 2));
}

exports.assignTable = (people) => {
  const tables = loadTables();

  // 找到可用 & capacity 足够的桌子
  const table = tables.find(t => t.capacity >= people && t.available !== false);

  if (!table) return null;

  // 占用桌子
  table.available = false;
  saveTables(tables);

  return table;
};

exports.releaseTable = (id) => {
  const tables = loadTables();

  const table = tables.find(t => t.id == id);
  if (!table) return;

  table.available = true;
  saveTables(tables);
};
