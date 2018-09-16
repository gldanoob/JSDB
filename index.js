const db = require('./jsdb');

async function playWithDB() {
    const test = await db.createDB("test");
    const table = test.addTable("table");
    const column = table.addColumn('lol')
    column.add(1, 2, 3)

    await test.update();
}

playWithDB();