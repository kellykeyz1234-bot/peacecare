require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('./models'); // loads all models + associations before syncing

const { protect } = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const billRoutes = require('./routes/billRoutes');

// Stop the server early if the JWT secret is missing
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in your .env file');
  process.exit(1);
}

connectDB();

const app = express();

// Only allow your React app to call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => res.send('Medical Management System API is running'));

// Public: register and login (authRoutes protects /me by itself)
app.use('/api/auth', authRoutes);

// Protected: the user must be logged in.
// Role checks (PATIENT, DOCTOR, ADMIN) happen inside each route file.
app.use('/api/users', protect, userRoutes);
app.use('/api/appointments', protect, appointmentRoutes);
app.use('/api/records', protect, recordRoutes);
app.use('/api/bills', protect, billRoutes);

// Unknown API routes
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));