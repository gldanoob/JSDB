const fs = require('fs');

exports.createDB = name => new Promise((res, rej) => {
    fs.writeFile(name + ".jsdb", Date(), err => {
        if (err) rej(err);
        log("Database '" + name + "' created successfully");
        res(new JSDB(name));
    });
});

exports.parseDB = name => new Promise((res, rej) => {
    if (!name || typeof name !== 'string') 
        throw new Error('Unprovided database name');
    fs.readFile(name + ".jsdb", 'utf8', (err, data) => {
        if (err) rej(err);
        const db = new JSDB(name);
        const tables = data.split('\n\n');
        tables.shift();
        for (const t of tables) {
            const columns = t.split('\n');
            const table = db.addTable(columns.shift());
            for (const c of columns) {
                const data = c.split(' ');
                const column = table.addColumn(decodeURI(data.shift()));
                for (const d of data)
                    if (d == "null") column.add(null);
                    else if (d.match(/`.*`/))
                        column.add(JSON.parse(decodeURI(d.substring(1, d.length - 1))));
                    else if (d.match(/".*"/))
                        column.add(decodeURI(d.substring(1, d.length - 1)));
                    else if (d == "true") column.add(true);
                    else if (d == "false") column.add(false);
                    else column.add(parseFloat(d));
            }
        }
        log("Database '" + name + "' parsed successfully");
        res(db);
    })
});


function checkArrays(arr1, arr2) {
    for (const val of arr1)
        if (!arr2.includes(val)) return false;
    return true;
}

function isValidData(data) {
    if (typeof data === "function" || data === undefined || Number.isNaN(data))
        throw new Error("Data value can't be a function, undefined or NaN.");
    return true;
}

function isValidName(name) {
    if (typeof name === "string" && name != "")
        return true;
    throw new Error("The name can only be a non-empty string");
}


function log(message) {
    fs.appendFile("jsdb.log", message + " on " + Date() + " \n", err => {if(err) throw err});
}

class JSDB {
    constructor(db) {
        this.tables = {};
        this.db = db;
    }

    list() {
        return Object.keys(this.tables);
    }

    addTable(name) {
        isValidName(name);
        const table = new Table(name);
        this.tables[name] = table;
        log("Table '" + name + "' created in database '" + this.db + "' successfully");
        return table;
    }

    getTable(name) {
        const table = this.tables[name];
        if (!table) {
            log("Error finding table '" + name + "'");
            throw new Error("Can't find table: " + name);
        }
        return table;
    }

    deleteTable(name) {
        const table = this.tables[name];
        if (!table) throw new Error("Can't find table: " + name);
        log("Table '" + name + "' located in database '" + this.db + "' deleted successfully");
        delete this.tables[name];
    }

    update() {
        return new Promise((res, rej) => {
            let data = Date();
            for (const t in this.tables) {
                data += "\n\n" + t;
                for (const c of this.tables[t].columns) {
                    data += "\n" + encodeURI(c.name);
                    for (const d of c.data) {
                        data += " ";
                        if (d == null) data += 'null';
                        else if (typeof d == "object") 
                            data += '`' + encodeURI(JSON.stringify(d)) + '`';
                        else if (typeof d == "string")
                            data += '"' + encodeURI(d) + '"';
                        else
                            data += d;
                    }
                }
            }
            fs.writeFile(this.db + ".jsdb", data, err => {
                if (err) rej(err);
                res();
            });
        })
    }
}

class Table {
    constructor(name) {
        this.columns = [];
        this.name = name;
    }

    list() {
        return Object.keys(this.columns);
    }

    addColumn(name) {
        isValidName(name);
        const column = new Column(name);
        this.columns.push(column);
        log("Column '" + name + "' created in table '" + this.name + "' successfully");
        return column;
    }

    getColumn(name) {
        const column = this.columns.find(c => c.name == name);
        if (!column){
            log("Error finding column '" + name);
            throw new Error("Can't find column: " + name);
        }
        return column;
    }

    findColumns(...data) {
        if (!data.length) throw new Error("Data value can't be empty");
        const found = [];
        for (const c of this.columns)
            if (checkArrays(data, c.data)) found.push(c);
        return found;
    }

    deleteColumn(name) {
        const index = this.columns.findIndex(c => c.name == name);
        if (index == -1) throw new Error("Can't find column: " + name);
        log("Column '" + name + "' located in table '" + this.name + "' deleted successfully ");
        this.columns.splice(index, 1);
    }

    insertAllColumns(...data) {
        if (!data.length) throw new Error("Data value can't be empty");
        const lengths = [];
        for (const name in this.columns) lengths.push(this.columns[name].data.length);
        const maxLength = Math.max(...lengths);
        for (const column of this.columns) {
            const original = column.data.length;
            column.data.length = maxLength;
            column.data.fill(null, original, maxLength);
            const d = data.shift() === undefined? null: data.shift();
            if (isValidData(d)) column.data.push(d);
        }
        log("Data '" + data + "' inserted into all columns in table '" + this.name + "' successfully");
    }
}

class Column {
    constructor(name) {
        this.name = name;
        this.data = [];
    }

    list() {
        return this.data.slice();
    }

    add(...data) {
        for (const d of data) {
            if (isValidData(d)) this.data.push(d);
            log("Data '" + data + "' inserted into column '" + this.name + "' successfully");
        }
    }

    replace(oldData, newData, all) {
        for (const i in data) {
            if (d === oldData) {
                this.data[i] == newData;
                if (!all) return;
            }
        }
        log("Data '" + oldData + "' have been replaced with data values '" + newData + "' in column '" + this.name + "' successfully");
    }

    rename(name) {
        const oldName = this.name;
        if (isValidName(name))
            this.name = name;
        log("Column '" + oldName + "' renamed to '" + this.name + "' successfully ");
    }

    remove(...data) {
        for (const d of data) {
            if (!this.data.includes(d)) throw new Error("Can't find data value: " + d);
            this.data.splice(this.data.indexOf(d), 1);
        }
        log("Data '" + data + "' removed from column '" + this.name + "' successfully")
    }
}