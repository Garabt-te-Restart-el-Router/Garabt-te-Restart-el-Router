const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db = null;

async function connect() {
    if (db) return db;

    await client.connect();
    db = client.db("myDB");        // Required name
    return db;
}

module.exports = { connect };
