const uuid = require('uuid');
class JetpackRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.get('jetpacks').value();
  }

  createOne({ name, image }) {
    const newJetPack = {
      id: uuid(),
      name,
      image
    };

    this.db
      .get('jetpacks')
      .push(newJetPack)
      .write();

    return newJetPack;
  }
}

module.exports = JetpackRepository;
