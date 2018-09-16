const db = require('./jsdb');

async function playWithDB() {
    const test = await db.parseDB('test');
    const hi = test.getTable('hi');
    const col1 = hi.findColumns(13313131)
    console.log(col1)
}

playWithDB();