const db = require('./jsdb');

async function playWithDB() {
    const test = await db.createDB("test");
    const table = test.addTable("table");
    table.addColumn("lolz").add(42, "hi", "XD");
    table.addColumn("lolz2").add(43, "wow");
    table.addColumn("moo").add("cool");
    table.insertAllColumns(56, "meow");


    await test.update();
}

playWithDB();