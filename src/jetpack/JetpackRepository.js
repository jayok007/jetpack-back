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

  checkDate(startDate, endDate) {
    return moment(startDate).isBefore(moment(endDate));
  }

  get(id) {
    return this.db
      .get('jetpacks')
      .find({ id: id })
      .value();
  }

  isAvailable(jetpack, startDate, endDate) {
    // Check if start_date is before
    const bookingStartDate = moment(startDate);
    const bookingEndDate = moment(endDate);

    // Check if the jeptack is available
    let isAvailable = true;
    for (const booking of jetpack['bookings']) {
      // https://stackoverflow.com/questions/17593608/mysql-query-to-see-if-a-booking-will-conflict-with-another-booking
      if (
        !(
          bookingEndDate.isBefore(booking['startDate']) ||
          bookingStartDate.isAfter(booking['endDate'])
        )
      ) {
        isAvailable = false;
        break;
      }
    }
    return isAvailable;
  }

  bookOne(jetpack, startDate, endDate) {
    jetpack['bookings'].push({ startDate: startDate, endDate: endDate });

    const bookings = jetpack['bookings'];

    this.db
      .get('jetpacks')
      .find({ id: jetpack.id })
      .assign({ bookings })
      .write();

    return jetpack;
  }
}
module.exports = JetpackRepository;
