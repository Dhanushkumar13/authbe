const express = require('express');
const connectDB = require('./dbConfig');
const auth = require('./routes/auth');
const cors = require('cors');
const app = express();

require('dotenv').config();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api',auth);

const PORT = 5000;

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`)
});

