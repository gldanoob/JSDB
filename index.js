const db = require('./jsdb');

async function playWithDB() {
    const test = await db.parseDB('test');

    const table = test.getTable('table');

    const lol = table.getColumn('lol');

    console.log(lol.list());

}

playWithDB();