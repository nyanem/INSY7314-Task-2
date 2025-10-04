import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// middleware

// allows requests from frontend
app.use(cors());         

// parses JSON request bodies
app.use(express.json());  

// basic route
app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

// mongodb connection

// make sure your .env has ATLAS_URI for the connection string - you'll have to create your own .env file and also add the port number in there, mine is PORT=5000
const uri = process.env.ATLAS_URI; 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
