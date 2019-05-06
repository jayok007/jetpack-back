const uuid = require('uuid');
const moment = require('moment');

const isAvailable = (dateStart, dateEnd) => jetpack => {
  return jetpack.bookings.every(
    b =>
      moment(dateEnd).isBefore(moment(b.dateStart), 'day') ||
      moment(dateStart).isAfter(moment(b.dateEnd), 'day')
  );
};

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

  getAvailableJetpacks(dateStart, dateEnd) {
    return this.db
      .get('jetpacks')
      .filter(isAvailable(dateStart, dateEnd))
      .value();
  }
}
module.exports = JetpackRepository;
