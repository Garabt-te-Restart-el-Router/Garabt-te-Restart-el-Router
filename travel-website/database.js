// database.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; // MongoDB URL
const client = new MongoClient(url);

const dbName = "myDB"; // Must match project description

async function connect() {
    if (!client.isConnected?.()) {
        await client.connect();
    }
    return client.db(dbName);
}

module.exports = { connect };
