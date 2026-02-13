const mongoose = require('mongoose');

const uri = 'mongodb+srv://MayankSinh:anjali_1905@cluster0.rnvqcv4.mongodb.net/exam_system?retryWrites=true&w=majority';

console.log('Testing connection to MongoDB...');
mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('FAILURE: Could not connect to MongoDB Atlas.');
        console.error(err);
        process.exit(1);
    });
