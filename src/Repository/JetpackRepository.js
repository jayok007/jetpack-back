module.exports = class {
  constructor(db) {
    this.db = db;
  }

  create(jetpack) {
    if (!jetpack) {
      throw 'Jetpack object is undefined';
    }

    if (!jetpack.id || !jetpack.name) {
      throw 'Jetpack object is missing information';
    }

    this.db
      .get('jetpacks')
      .push(jetpack.toJson())
      .write();
  }
};
