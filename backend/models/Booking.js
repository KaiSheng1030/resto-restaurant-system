class Booking {
  constructor(id, name, people, time, table, phone, date) {
    this.id = id;
    this.name = name;
    this.people = people;
    this.time = time;
    this.table = table;
    this.phone = phone; // ⭐⭐⭐ FIXED
    this.date = date;
  }
}

module.exports = Booking;
