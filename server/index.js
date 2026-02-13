const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const seatingRoutes = require('./routes/seatingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/seating', seatingRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Exam Management System API is running...');
});

// Port
const PORT = process.env.PORT || 5000;

// Database connection cache
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        isConnected = true;
        console.log('SUCCESS: Connected to MongoDB Atlas');
    } catch (err) {
        console.error('ERROR: MongoDB connection failure:', err.message);
        throw err;
    }
};

// Middleware to ensure DB connection for every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const seatingRoutes = require('./routes/seatingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/seating', seatingRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Exam Management System API is running...');
});

// Listen - Only for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

module.exports = app;
