require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./models/db');
const authRoutes = require('./routes/auth');
const cookieParser = require("cookie-parser");
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // allows us to parse incoming requests with JSON payloads
app.use(cookieParser()); // allows us to parse incoming cookies

// Routes
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    connectToDatabase()
    console.log(`Server is listening on ${PORT}`); 
});
