

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_bookings';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));



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

const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Restaurant Booking API is running',
    timestamp: new Date()
  });
});


app.post('/api/bookings', async (req, res) => {
  try {
    const {
      customerName,
      numberOfGuests,
      bookingDate,
      bookingTime,
      cuisinePreference,
      specialRequests,
      weatherInfo,
      seatingPreference
    } = req.body;

    
    if (!customerName || !numberOfGuests || !bookingDate || !bookingTime || !cuisinePreference || !seatingPreference) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['customerName', 'numberOfGuests', 'bookingDate', 'bookingTime', 'cuisinePreference', 'seatingPreference']
      });
    }

    
    const bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);

    
    const booking = new Booking({
      bookingId,
      customerName,
      numberOfGuests,
      bookingDate: new Date(bookingDate),
      bookingTime,
      cuisinePreference,
      specialRequests: specialRequests || 'None',
      weatherInfo,
      seatingPreference,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
});


app.get('/api/bookings', async (req, res) => {
  try {
    const { status, date, cuisine } = req.query;
    
    
    let filter = {};
    if (status) filter.status = status;
    if (date) filter.bookingDate = new Date(date);
    if (cuisine) filter.cuisinePreference = cuisine;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: error.message 
    });
  }
});


app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found',
        bookingId: req.params.id 
      });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking',
      details: error.message 
    });
  }
});


app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found',
        bookingId: req.params.id 
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      error: 'Failed to update booking',
      details: error.message 
    });
  }
});


app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found',
        bookingId: req.params.id 
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    });
  }
});


app.post('/api/weather', async (req, res) => {
  try {
    const { date, location } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const city = location || 'New York'; // Default location

    if (!WEATHER_API_KEY) {
     
      return res.json({
        success: true,
        weather: {
          condition: 'sunny',
          temperature: 22,
          description: 'Clear skies',
          humidity: 45,
          windSpeed: 12,
          location: city,
          date: date
        },
        note: 'Using mock data - set WEATHER_API_KEY in .env for real data'
      });
    }

   
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    
    const targetDate = new Date(date);
    const forecasts = response.data.list;
    
   
    const closestForecast = forecasts.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.dt_txt) - targetDate);
      const currDiff = Math.abs(new Date(curr.dt_txt) - targetDate);
      return currDiff < prevDiff ? curr : prev;
    });

    const weatherData = {
      condition: closestForecast.weather[0].main.toLowerCase(),
      temperature: Math.round(closestForecast.main.temp),
      description: closestForecast.weather[0].description,
      humidity: closestForecast.main.humidity,
      windSpeed: closestForecast.wind.speed,
      location: city,
      date: date
    };

    res.json({
      success: true,
      weather: weatherData
    });

  } catch (error) {
    console.error('Weather API error:', error.message);
    
    
    res.json({
      success: true,
      weather: {
        condition: 'sunny',
        temperature: 22,
        description: 'Clear skies',
        humidity: 45,
        windSpeed: 12,
        location: req.body.location || 'New York',
        date: req.body.date
      },
      note: 'Using mock data due to API error'
    });
  }
});


app.get('/api/analytics/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Most popular cuisine
    const cuisineStats = await Booking.aggregate([
      { $group: { _id: '$cuisinePreference', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    
    const seatingStats = await Booking.aggregate([
      { $group: { _id: '$seatingPreference', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        byCuisine: cuisineStats,
        bySeating: seatingStats
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message 
    });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${MONGODB_URI}`);
});