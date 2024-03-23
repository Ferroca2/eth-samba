import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
