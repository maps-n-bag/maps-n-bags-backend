import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());
app.use(cors());

//////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/azgor', (req, res) => {
  res.send('Hello Azgor!');
});

//////////////////////////////////////////////////////////////

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
}
);