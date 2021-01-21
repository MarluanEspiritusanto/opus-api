import express from 'express';
import logger from 'morgan';
import {createConnection} from 'typeorm';
import usersRouter from './users/route';
require('dotenv').config();

if (process.env.ENVIRONMENT == 'dev'){    
    createConnection({
        type: "sqlite",
        synchronize: false,
        database: "../database.sqlite",
        entities: [`${__dirname}/framework/entities/**/*.ts`],
    }).then(connection => {
        console.log('Database connected');
    });
}
else
{
    console.log("Need to configure db in prod");
}




var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/v1/user', usersRouter);

module.exports = app;
