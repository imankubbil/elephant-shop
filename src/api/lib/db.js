const pgPromise = require('pg-promise');
const Promise = require('bluebird');
const dotenv = require('dotenv');

dotenv.config();

const configDb = () => {
  // const options = {
  //   promiseLib: Promise
  // };
  
  // const cn = {
  //   host: '127.0.0.1',
  //   port: process.env.DB_PORT, //5432
  //   database: process.env.DB_NAME,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD
  // }
  // console.log(cn)
  
  // const pgp = pgPromise(cn);
  // // const dbPgp = pgp(cn);
  // return pgp;

  const cn = {
    host: 'localhost',
    port: 5433,
    database: 'elephant-shop',
    user: 'postgres',
    password: '1234',
    // max: 30 // use up to 30 connections

    // "types" - in case you want to set custom type parsers on the pool level
  };

  const pgp = pgPromise();
  const db = pgp(cn);
  return db;
}

const Helpers = pgPromise().helpers;
const db = configDb();

module.exports = { db, Helpers };
