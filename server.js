const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // ✅ REQUIRED
require('dotenv').config();

const connectDB = require('./config');
const authRoutes = require('./routes/auth');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS config
const allowedOrigins = [
    'https://spontaneous-sable-46ffac.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.options('*', cors());
app.use(bodyParser.json());

// ✅ API routes
app.use('/api/auth', authRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

// ✅ PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
