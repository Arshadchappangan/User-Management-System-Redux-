const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/admin',adminRoutes)
app.use('/',userRoutes)

connectDB();

const PORT = process.env.PORT || 3555
app.listen(PORT,() => {
    console.log(`Server Running : ${PORT}`);
});