const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendCredentialsEmail } = require('../utils/emailHelper');

// Helper to create JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Signup controller
exports.signup = async (req, res) => {
    try {
        const { name, rollNumber, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [
                { rollNumber: rollNumber || '____none____' },
                { email: email || '____none____' }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this Roll Number or Email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            rollNumber,
            email,
            password: hashedPassword,
            role
        });

        const token = createToken(user._id);

        // Send email to student (async, so we don't wait for it to finish)
        if (role === 'student' && email) {
            sendCredentialsEmail(email, name, rollNumber, password);
        }

        res.status(201).json({ user: { id: user._id, name, role, rollNumber, email }, token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login controller
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be rollNumber or email

        const user = await User.findOne({
            $or: [{ rollNumber: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.status(200).json({
            user: { id: user._id, name: user.name, role: user.role, rollNumber: user.rollNumber, email: user.email },
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get current user data
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ id: user._id, name: user.name, role: user.role, rollNumber: user.rollNumber, email: user.email });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all students (Admin only)
exports.getAllStudents = async (req, res) => {
    try {
        // Only return users with role 'student'
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a student (Admin only)
exports.deleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update current user
exports.updateMe = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            id: user._id,
            name: user.name,
            role: user.role,
            rollNumber: user.rollNumber,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
