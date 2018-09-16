const db = require('./jsdb');

async function playWithDB() {
    const test = await db.createDB("test");
    const table = test.addTable("table");
    table.addColumn("lolz").add(42, "hi", "XD");

    await test.update();
}

playWithDB();