
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/auth');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json(
  {
    origin: ["https://entertainment-app-beta.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
