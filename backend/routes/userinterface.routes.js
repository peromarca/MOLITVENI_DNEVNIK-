const express = require('express');
const router = express.Router();
const { Client } = require('pg');


const con = new Client({
   host: "localhost",
   user: "postgres",
   port: 5432,
   password: "oblak333",
   database: "dnevnik"
});

con.connect().then(() => {
   console.log("Uspesno povezivanje sa bazom podataka");
}).catch((err) => {
   console.log("Greska prilikom povezivanja sa bazom podataka: " + err);
});








module.exports = router;