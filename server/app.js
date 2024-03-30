const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();


app.use(cors());

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));


app.use(express.json());


module.exports = app;