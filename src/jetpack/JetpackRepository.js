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

  updateOne(id, key, value) {
    const updatedJetpack = this.db
      .get('jetpacks')
      .find({ id })
      .assign({ key: value })
      .value();

    return updatedJetpack;
  }
}

module.exports = JetpackRepository;
