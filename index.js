const db = require('./jsdb');

async function playWithDB() {
    const test = await db.createDB("test");
    const table = test.addTable("table");
    const column = table.addColumn('lol')
    const xd = table.addColumn('xd')
    table.insertAllColumns(2)

    await test.update();
}

playWithDB();