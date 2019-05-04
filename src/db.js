const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');

const adapter =
  process.env.NODE_ENV === 'test' ? new Memory() : new FileSync('db.json');

module.exports = () => low(adapter);
