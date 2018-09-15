const fs = require('fs');

exports.createDB = name => new JSDB(name);

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