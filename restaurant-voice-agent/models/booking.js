const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  cuisinePreference: {
    type: String,
    enum: ['Italian', 'Chinese', 'Indian', 'American', 'Other'],
    required: true
  },
  specialRequests: {
    type: String,
    default: 'None'
  },
  weatherInfo: {
    condition: String,
    temperature: Number,
    description: String,
    humidity: Number,
    windSpeed: Number
  },
  seatingPreference: {
    type: String,
    enum: ['Indoor', 'Outdoor'],
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);