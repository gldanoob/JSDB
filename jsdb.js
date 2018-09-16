const fs = require('fs');

exports.createDB = name => new Promise((res, rej) => {
    fs.writeFile(name + ".jsdb", Date(), err => {
        if (err) rej(err);
        res(new JSDB(name));
    });
});

exports.parseDB = name => new Promise((res, rej) => {
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
                    if (d.match(/".*"/))
                        column.add(decodeURI(d.substring(1, d.length - 1)));
                    else column.add(parseFloat(d));
            }
        }
        res(db);
    })
});


function checkArrays(arr1, arr2) {
    for (const val of arr1) {
        if (!arr2.includes(val)) return false;
    }
    return true;
}

class JSDB {
    constructor(db) {
        this.tables = {};
        //name of the database
        this.db = db;
    }

    list() {
        return Object.keys(this.tables);
    }

    addTable(name) {
        if (!name) throw new Error("Table name can't be empty");
        const table = new Table(name);
        this.tables[name] = table;
        return table;
    }

    getTable(name) {
        const table = this.tables[name];
        if (!table) throw new Error("Can't find table: " + name);
        return table;
    }

    deleteTable(name) {
        const table = this.tables[name];
        if (!table) throw new Error("Can't find table: " + name);
        delete this.tables[name];
    }

    update() {
        return new Promise((res, rej) => {
            let data = Date();
            for (const t in this.tables) {
                data += "\n\n" + t;
                for (const c in this.tables[t].columns) {
                    data += "\n" + encodeURI(c);
                    for (const d of this.tables[t].columns[c].data) {
                        data += " ";
                        if (typeof d == "string")
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
    constructor() {
        this.columns = {};
    }

    list() {
        return Object.keys(this.columns);
    }

    addColumn(name) {
        if (!name) throw new Error("Column name can't be empty");
        const column = new Column();
        this.columns[name] = column;
        return column;

    }

    getColumn(name) {
        const column = this.columns[name];
        if (!column) throw new Error("Can't find column: " + name);
        return column;
    }

    findColumns(...data) {
        if (!data) throw new Error("Data value can't be empty");
        const found = [];
        for (const name in this.columns) {
            const finding = this.columns[name];
            if (checkArrays(data, finding.data)) found.push(finding);
        }
        return found;
    }

    deleteColumn(name) {
        const column = this.columns[name];
        if (!column) throw new Error("Can't find column: " + name);
        delete this.columns[name];
    }

    insertAllColumns(...data) {
        let lengths = [];
        for (const d of data){
            if (!d) throw new Error("Data value can't be empty");
            for (const name in this.columns) lengths.push(this.columns[name].data.length);
            const maxLength = Math.max(...lengths);
            for (const name in this.columns){
                const lens = this.columns[name].data.length;
                if (lens < maxLength){
                    const original = lens;
                    this.columns[name].data.length = maxLength;
                    this.columns[name].data.fill(null, original, maxLength);
                }
                this.columns[name].data.push(d);
            }
        }
    }

}

class Column {
    constructor() {
        this.data = [];
    }

    list() {
        return this.data.slice();
    }

    add(...data) {
        for (const d of data) {
            if (!d) throw new Error("Data value can't be empty");
            if (["string", "number"].includes(typeof d))
                this.data.push(d);
            else throw new Error("Data can only be a string or number");
        }
    }

    replace(oldData, newData, all) {
        for (const i in data) {
            if (d === oldData) {
                this.data[i] == newData;
                if (!all) return;
            }
        }
    }

    remove(...data) {
        for (const d of data){
            if (!d) throw new Error("Data value can't be empty");
            if (!this.data.includes(d)) throw new Error("Can't find data value: " + d);
            this.data.splice(this.data.indexOf(d), 1);
        }
    }

}