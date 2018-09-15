const db = require('./jsdb');

const test = db.createDB("test");

const table = test.addTable("tablename");
const column = table.addColumn("columnname");
const column2 = table.addColumn("columnname2");
const column3 = table.addColumn("columnname3");
column.add("A string");
column.add(343);
column2.add("A string");
column2.add(100);
column3.add("The string");
column3.add(50);
test.update();

const foundColumns = table.findAllColumns("A string");
const foundColumns2 = table.findAllColumns(["A string", 100]);
const foundColumn = table.findOneColumn("A string");
const foundColumn2 = table.findOneColumn(["A string", 343]);
console.log(foundColumns);
console.log(foundColumns2);
console.log(foundColumn);
console.log(foundColumn2);