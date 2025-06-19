import express from  'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api/auth', router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});