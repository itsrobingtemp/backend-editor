const mongo = require("mongodb").MongoClient;
const config = require("./config.json");
const collectionName = "docs";

const database = {
  getDb: async function getDb() {
    let dsn = process.env.DB_CONNECTION;

    if (process.env.NODE_ENV === "test") {
      // We can even use MongoDB Atlas for testing
      dsn = "mongodb://localhost:27017/test";
    }

    const client = await mongo.connect(dsn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = await client.db();
    const collection = await db.collection(collectionName);

    return {
      collection: collection,
      client: client,
    };
  },
};

module.exports = database;
