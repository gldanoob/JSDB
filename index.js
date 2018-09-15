const db = require('./jsdb');

const test = db.createDB("test");

const table = test.addTable("tablename");
const column = table.addColumn("columnname");
const column2 = table.addColumn("columnname2");
column.add("A string");
column.add(343);
column2.add("A string");
column2.add(100);
test.update();

const foundColumns = table.findAllColumns("A string");
console.log(foundColumns);