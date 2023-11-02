const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const loginRoute = require('./routes/authentication/login');
const registerationRoute = require('./routes/authentication/registration');
const uploadImages = require('./routes/upload/upload');

const dbURL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/cirtus_farm_db';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/login', loginRoute);
app.use('/register', registerationRoute);
app.use('/upload', uploadImages);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
