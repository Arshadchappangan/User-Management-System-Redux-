const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.use('/',userRoutes)

connectDB();

const PORT = process.env.PORT || 3555
app.listen(PORT,() => {
    console.log(`Server Running : ${PORT}`);
});