var exception = require('../lib/exception');
var mongoPool = require('../lib/mongoPool');

exports.save = function (doc, cb) {
  mongoPool.acquire(function (err, client) {
    if (err) {
      return cb(exception(exception.MongoPoolError, err.message));
    }
    client
      .db('dummydb')
      .collection('users')
      .insert(doc, function (err, res) {
        if (err) {
          mongoPool.release(client);
          return cb(exception(exception.DBError, err.message));
        }
        mongoPool.release(client);
        cb(null, res);
      });
  });
};

exports.get = function (name, cb) {
  mongoPool.acquire(function (err, client) {
    if (err) {
      return cb(exception(exception.MongoPoolError, err.message));
    }
    client
      .db('dummydb')
      .collection('users')
      .findOne({"name": name}, {"_id": 0}, function (err, doc) {
        if (err) {
          mongoPool.release(client);
          return cb(exception(exception.DBError, err.message));
        }
        mongoPool.release(client);
        cb(null, doc);
      });
  });
};