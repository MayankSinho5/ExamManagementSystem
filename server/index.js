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

// Connect to MongoDB
// Note: User needs to provide a real MONGODB_URI in .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
