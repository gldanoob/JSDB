const db = require('./jsdb');

async function playWithDB() {
    const test = await db.createDB('test');
    test.addTable('hi').addColumn('lol').add(1, 2, 3)

    await test.update();

    const test1 = await db.parseDB('test');

    console.log(test1);
    
}

playWithDB();