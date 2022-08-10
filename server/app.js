const express = require('express');
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'false');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Range, Content-Disposition, Authorization');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, PATCH, DELETE');
    next();
  }
app.use(allowCrossDomain);
app.use('/api', routes);
  
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
});