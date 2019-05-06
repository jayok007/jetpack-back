const uuid = require('uuid');
const moment = require('moment');

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
      bookings: [],
      image
    };

    this.db
      .get('jetpacks')
      .push(newJetPack)
      .write();

    return newJetPack;
  }

  updateOne({ id, name, image }) {
    this.db
      .get('jetpacks')
      .find({ id })
      .assign({ name, image })
      .write();

    return { id, name, image };
  }

  getOne(id) {
    return this.db
      .get('jetpacks')
      .find({ id })
      .value();
  }

  bookOne(jetpack, dateStart, dateEnd) {
    const booking = {
      dateStart: moment(dateStart).format('YYYY-MM-DD'),
      dateEnd: moment(dateEnd).format('YYYY-MM-DD')
    };

    this.db
      .get('jetpacks')
      .find({ id: jetpack.id })
      .assign({ bookings: [...jetpack.bookings, booking] })
      .write();

    return booking;
  }
}
module.exports = JetpackRepository;
