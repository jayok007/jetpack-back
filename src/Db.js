var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('db.json');

var db = low(adapter);

// Set some defaults
db.defaults({ jetpacks: [] }).write();

module.exports = db;
