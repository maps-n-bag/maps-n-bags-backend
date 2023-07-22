// import { hello } from './hello.js';
// import hola from './hello.cjs';

import express from 'express';
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
}
);


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
}
);