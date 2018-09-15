const db = require('./jsdb');

const test = db.createDB("test");

const table = test.addTable("tablename");
const column = table.addColumn("columnname");
column.add("A string");
column.add(343);
test.update();