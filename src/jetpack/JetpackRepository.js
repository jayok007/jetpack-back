class JetpackRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.get('jetpacks').value();
  }

  createOne(jetpack) {
    this.db
      .get('jetpacks')
      .push(jetpack)
      .write();
  }
}

module.exports = JetpackRepository;
