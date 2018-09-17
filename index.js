const db = require('./jsdb');

async function playWithDB() {
    const test = await db.parseDB('test');

    const table = test.getTable('table');

    const hi = table.getColumn('hi');


    hi.add({lol: "this is an object"});

    console.log(hi.list());

    await test.update();
}

playWithDB();