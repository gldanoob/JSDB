const fs = require('fs');

exports.createDB = name => new JSDB(name);

function checkArrays(arr1, arr2){
    for (const val of arr1){
        if (!arr2.includes(val)) return false;
    }
    return true;
}

class JSDB {
    constructor(db) {
        this.tables = {};
        //name of the database
        this.db = db;
        // Logs the date when the DB is created
        fs.writeFile(this.db + ".jsdb", Date(), err => {
            if (err) throw err;
        });
    }

    addTable(name) {
        if (!name) throw new Error("Table name can't be empty");
        const table = new Table(name);
        this.tables[name] = table;
        return table;
    }

    update() {
        let data = Date() + "\n";
        for (const t in this.tables) {
            data += "#" + t + "\n";
            for (const c in this.tables[t].columns) {
                data += c + " ";
                for (const d of this.tables[t].columns[c].data) {
                    if (typeof d == "string")
                        data += '"' + d + '"';
                    else 
                        data += d;
                    data += " ";
                }
                data += "\n";
            }
        }
        fs.writeFile(this.db + ".jsdb", data, err => {
            if (err) throw err;
            
        });
    }
}

class Table {
    constructor() {
        this.columns = {};
    }
    addColumn(name) {
        if (!name) throw new Error("Column name can't be empty");
        const column = new Column();
        this.columns[name] = column;
        return column;
        
    }
    findAllColumns(data){
        if (!data) throw new Error("Data value can't be empty");
        let foundColumns = [];
        let findColumn;
        if (["string", "number"].includes(typeof data)){
            for (const name in this.columns){
                if (this.columns.hasOwnProperty(name)) findColumn = this.columns[name];
                if (findColumn.data.includes(data)) foundColumns.push(findColumn);
            }
        }
        else if (Array.isArray(data)){
            for (const name in this.columns) {
                if (this.columns.hasOwnProperty(name)) findColumn = this.columns[name];
                if (checkArrays(data, findColumn.data)) foundColumns.push(findColumn)
                }
            }
        return foundColumns;
    }
    findOneColumn(data){
        if (!data) throw new Error("Data value can't be empty");
        let findColumn;
        let foundColumn;
        if (["string", "number"].includes(typeof data)){
            for (const name in this.columns){
                if (this.columns.hasOwnProperty(name)) findColumn = this.columns[name];
                if (findColumn.data.includes(data)) foundColumn = findColumn;
            }
        }
        else if (Array.isArray(data)){
            for (const name in this.columns){
                if (this.columns.hasOwnProperty(name)) findColumn = this.columns[name];
                if (checkArrays(data, findColumn.data)) foundColumn = findColumn;
                }
            }
        return findColumn;
        }
}

class Column {
    constructor(column) {
        this.column = column;
        this.data = [];
    }
    add(data) {
        if (!data) throw new Error("Data value can't be empty");
        if (["string", "number"].includes(typeof data))
        this.data.push(data);
    }
}