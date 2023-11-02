const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'));

const loginRoute = require('./routes/authentication/login');
const registerationRoute = require('./routes/authentication/registration');
const uploadImages = require('./routes/upload/upload');

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/cirtus_farm_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }

    app.use('/login', loginRoute);
    app.use('/register', registerationRoute);
    app.use('/upload', uploadImages);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
