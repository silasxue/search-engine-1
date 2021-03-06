const { MongoClient } = require('mongodb');

const useDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER;
const host = useDocker ? 'mongo' : 'localhost:27017';
const url = `mongodb://${host}/learn-anything`;

/*
 * Access a mongodb collection. Create it if it doesn't exist.
 * Callback function is called with DB and collection as parameters.
 */
module.exports = (name, callback) => {
  // Connect to DB.
  MongoClient.connect(url)
    .then((db) => {
      // Create collection if it doesn't exist and access it.
      db.createCollection(name)
        .then((collection) => {
          // collection.createIndex({ key: 'text' });

          if (typeof callback === 'function') {
            callback(db, collection);
          }
        })
        .catch((err) => { throw err; });
    })
    .catch((err) => { throw err; });
};
