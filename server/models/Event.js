const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  color: String,
  start: Date,
  end: Date
});

module.exports = mongoose.model('Event', eventSchema);
