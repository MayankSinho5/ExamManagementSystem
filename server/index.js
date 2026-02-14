const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection logic for Serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        console.log('Connecting to MongoDB Atlas...');
        // Disable buffering to fail fast if connection is down
        mongoose.set('bufferCommands', false);

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('SUCCESS: Connected to MongoDB Atlas');
    } catch (err) {
        console.error('ERROR: MongoDB connection failure:', err.message);
        throw err;
    }
};

// Global Middlewares
app.use(cors());
app.use(express.json());

// Ensure DB connection for every request (Serverless requirement)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Request failed due to DB connection error');
        res.status(500).json({ error: 'Database connection failed. Please try again.' });
    }
});

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

// Local development server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

module.exports = app;
