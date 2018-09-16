# JSDB Documentation

## Contents
- [Example](#example)
- [Methods](#methods)
- [Classes](#classes)


## Example
```js
async function example() {
    const db = require('./jsdb');
    const myDB = await db.createDB('myDB');
    const myTable = myDB.addTable('myTable');
    myTable.addColumn('Column').add("string1", 342, "string2");

    // Save changes
    await myDB.update();
}
example();
```


## Methods

- `await createDB(name)`: creates a database and returns the [JSDB](#jsdb) object  
- `await parseDB(name)`: parse an existing database and returns the [JSDB](#jsdb) object  

## Classes

### JSDB
- `list()`: returns an array of table names  
- `addTable(name)`: adds a table of the `name` into the database and returns the [Table](#table) object  
- `getTable(name)`: gets the table by `name` and returns it as a [Table](#table) object  
- `await update()`: save changes to the database
- `deleteTable(name)`: deletes the table named `name` 

### Table
- `list()`: returns an array of column names  
- `addColumn(name)`: adds a column of the `name` into the table and returns the [Column](#column) object  
- `getColumn(name)`: gets the column by `name` and returns it as a [Column](#column) object  
- `findColumns(data1, data2...)`: returns all columns with the matching data
- `deleteColumn(name)`: deletes the column named `name`

### Column
- `list()`: returns an array of data values 
- `add(data1, data2...)`: adds the data into the column 
- `replace(oldData, newData, all?)`: replaces all `oldData` with `newData` if all is set to `true`, or else replaces the first `oldData`
- `remove(data1, data2...)` : removes the data from the column
