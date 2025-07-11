const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Proper CORS configuration
app.use(cors({
    origin: 'https://spontaneous-sable-46ffac.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// ✅ Handle preflight requests (important for CORS)
app.options('*', cors());

// ✅ Middleware to parse JSON
app.use(bodyParser.json());

// ✅ Your routes
app.use('/api/auth', authRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
