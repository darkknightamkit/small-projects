  
**URL:** `http://localhost:5000/api/bookings`  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (raw JSON):**
```json
{
  "customerName": "Alice Johnson",
  "numberOfGuests": 4,
  "bookingDate": "2026-02-14",
  "bookingTime": "19:30",
  "cuisinePreference": "Italian",
  "specialRequests": "Anniversary celebration, need window seat",
  "weatherInfo": {
    "condition": "sunny",
    "temperature": 22,
    "description": "Clear skies",
    "humidity": 45,
    "windSpeed": 12
  },
  "seatingPreference": "Outdoor"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "bookingId": "BK1706112345678",
    "customerName": "Alice Johnson",
    "numberOfGuests": 4,
    "bookingDate": "2026-02-14T00:00:00.000Z",
    "bookingTime": "19:30",
    "cuisinePreference": "Italian",
    "specialRequests": "Anniversary celebration, need window seat",
    "weatherInfo": {
      "condition": "sunny",
      "temperature": 22,
      "description": "Clear skies",
      "humidity": 45,
      "windSpeed": 12
    },
    "seatingPreference": "Outdoor",
    "status": "confirmed",
    "createdAt": "2026-01-24T12:30:45.678Z",
    "_id": "65b1234567890abcdef12345"
  }
}
```

### 2. Get All Bookings

**Method:** GET  
**URL:** `http://localhost:5000/api/bookings`

**Query Parameters (optional):**
- `status=confirmed`
- `cuisine=Italian`
- `date=2026-02-14`

**Example:** `http://localhost:5000/api/bookings?status=confirmed&cuisine=Italian`

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "bookings": [
    {
      "bookingId": "BK1706112345678",
      "customerName": "Alice Johnson",
      "numberOfGuests": 4,
      // ... rest of booking data
    },
    {
      "bookingId": "BK1706112345679",
      "customerName": "Bob Smith",
      "numberOfGuests": 2,
      // ... rest of booking data
    }
  ]
}
```

### 3. Get Specific Booking

**Method:** GET  
**URL:** `http://localhost:5000/api/bookings/BK1706112345678`

**Expected Response:**
```json
{
  "success": true,
  "booking": {
    "bookingId": "BK1706112345678",
    "customerName": "Alice Johnson",
    // ... full booking details
  }
}
```

### 4. Update Booking

**Method:** PUT  
**URL:** `http://localhost:5000/api/bookings/BK1706112345678`

**Body (raw JSON):**
```json
{
  "numberOfGuests": 6,
  "specialRequests": "Anniversary celebration, need window seat and birthday cake"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "booking": {
    // updated booking data
  }
}
```

### 5. Cancel Booking

**Method:** DELETE  
**URL:** `http://localhost:5000/api/bookings/BK1706112345678`

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "bookingId": "BK1706112345678",
    "status": "cancelled",
    // ... rest of booking data
  }
}
```

### 6. Get Weather Forecast

**Method:** POST  
**URL:** `http://localhost:5000/api/weather`

**Body (raw JSON):**
```json
{
  "date": "2026-02-14",
  "location": "New York"
}
```

**Expected Response:**
```json
{
  "success": true,
  "weather": {
    "condition": "sunny",
    "temperature": 22,
    "description": "Clear skies",
    "humidity": 45,
    "windSpeed": 12,
    "location": "New York",
    "date": "2026-02-14"
  }
}
```

### 7. Get Analytics

**Method:** GET  
**URL:** `http://localhost:5000/api/analytics/stats`

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "confirmed": 20,
    "cancelled": 5,
    "byCuisine": [
      { "_id": "Italian", "count": 10 },
      { "_id": "Chinese", "count": 8 },
      { "_id": "Indian", "count": 5 },
      { "_id": "American", "count": 2 }
    ],
    "bySeating": [
      { "_id": "Indoor", "count": 15 },
      { "_id": "Outdoor", "count": 10 }
    ]
  }
}
```

## Using cURL

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Charlie Brown",
    "numberOfGuests": 3,
    "bookingDate": "2026-02-20",
    "bookingTime": "18:00",
    "cuisinePreference": "Chinese",
    "specialRequests": "Vegetarian options needed",
    "seatingPreference": "Indoor"
  }'
```

### Get All Bookings
```bash
curl http://localhost:5000/api/bookings
```

### Get Specific Booking
```bash
curl http://localhost:5000/api/bookings/BK1706112345678
```

### Update Booking
```bash
curl -X PUT http://localhost:5000/api/bookings/BK1706112345678 \
  -H "Content-Type: application/json" \
  -d '{
    "numberOfGuests": 5
  }'
```

### Cancel Booking
```bash
curl -X DELETE http://localhost:5000/api/bookings/BK1706112345678
```

### Get Weather
```bash
curl -X POST http://localhost:5000/api/weather \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-14",
    "location": "London"
  }'
```

### Get Analytics
```bash
curl http://localhost:5000/api/analytics/stats
```

## JavaScript/Fetch Examples

### Create Booking
```javascript
const createBooking = async () => {
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerName: "Diana Prince",
      numberOfGuests: 2,
      bookingDate: "2026-02-18",
      bookingTime: "20:00",
      cuisinePreference: "Indian",
      specialRequests: "Gluten-free options",
      seatingPreference: "Indoor"
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Get All Bookings
```javascript
const getAllBookings = async () => {
  const response = await fetch('http://localhost:5000/api/bookings');
  const data = await response.json();
  console.log(data);
};
```

### Update Booking
```javascript
const updateBooking = async (bookingId) => {
  const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      numberOfGuests: 4,
      specialRequests: "Window seat preferred"
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "required": [
    "customerName",
    "numberOfGuests",
    "bookingDate",
    "bookingTime",
    "cuisinePreference",
    "seatingPreference"
  ]
}
```

### 404 Not Found
```json
{
  "error": "Booking not found",
  "bookingId": "BK1706112345678"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create booking",
  "details": "Database connection error"
}
```

## Testing Checklist

- [ ] Health check endpoint works
- [ ] Create booking with all required fields
- [ ] Create booking missing required fields (should fail)
- [ ] Get all bookings
- [ ] Get bookings with filters
- [ ] Get specific booking
- [ ] Get non-existent booking (should return 404)
- [ ] Update booking
- [ ] Cancel booking
- [ ] Get weather forecast
- [ ] Get analytics
- [ ] Test CORS from frontend
- [ ] Verify MongoDB entries

## MongoDB Verification

### Check bookings in MongoDB shell
```javascript
// Connect to MongoDB
mongosh

// Switch to database
use restaurant_bookings

// View all bookings
db.bookings.find().pretty()

// Count bookings
db.bookings.countDocuments()

// Find by status
db.bookings.find({ status: "confirmed" }).pretty()

// Find by cuisine
db.bookings.find({ cuisinePreference: "Italian" }).pretty()

// Delete all bookings (for testing)
db.bookings.deleteMany({})
```

## Performance Testing

### Load Testing with Apache Bench
```bash

ab -n 100 -c 10 -p booking.json -T application/json http://localhost:5000/api/bookings


ab -n 1000 -c 50 http://localhost:5000/api/bookings
```

```json
{
  "customerName": "Test User",
  "numberOfGuests": 2,
  "bookingDate": "2026-02-15",
  "bookingTime": "19:00",
  "cuisinePreference": "Italian",
  "seatingPreference": "Indoor"
}
```



```javascript
const request = require('supertest');
const app = require('../server');

describe('Booking API', () => {
  let bookingId;

  test('Should create a new booking', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: "Test User",
        numberOfGuests: 4,
        bookingDate: "2026-02-15",
        bookingTime: "19:00",
        cuisinePreference: "Italian",
        seatingPreference: "Indoor"
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    bookingId = response.body.booking.bookingId;
  });

  test('Should get all bookings', async () => {
    const response = await request(app).get('/api/bookings');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Should get specific booking', async () => {
    const response = await request(app).get(`/api/bookings/${bookingId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.booking.bookingId).toBe(bookingId);
  });
});
```
