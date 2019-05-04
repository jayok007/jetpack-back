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

  updateOne({ id, name, image }) {
    const updatedJetpack = {
      id,
      name,
      image
    };

    this.db
      .get('jetpacks')
      .find({ id })
      .assign({ name, image })
      .write();

    return updatedJetpack;
  }
}

module.exports = JetpackRepository;
