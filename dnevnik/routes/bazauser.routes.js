const express = require('express');
const router = express.Router();
const { Client } = require('pg');

// Database konekcija
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

router.get('/ispisiKorisnike', (req, res) => {
   const fetch_query = 'SELECT * FROM DnevnikUser';
   con.query(fetch_query, (err, result) => {
      if (err) {
         res.send("Greska prilikom izvrsavanja upita: " + err);
      } else {
         res.send("Podaci o korisnicima: " + JSON.stringify(result.rows));
      }

   });
});


router.post('/dodajKorisnika', (req, res) => {

   const { username, pass, idnum } = req.body;
   const insert_query = 'INSERT INTO DnevnikUser (username, pass, idnum) VALUES ($1, $2, $3)';
   con.query(insert_query, [username, pass, idnum], (err, result) => {
      if (err) {
         console.log("Greska prilikom dodavanja korisnika: " + err);
         res.status(500).send("Greska prilikom dodavanja korisnika");
      } else {
         console.log("Korisnik uspesno dodat");
         res.status(200).send("Korisnik uspesno dodat");
      }


   });
});

router.get('/fetchId/:id', (req, res) => {
   const id = req.params.id;
   const fetch_query = 'SELECT * FROM DnevnikUser WHERE idnum=$1';
   con.query(fetch_query, [id], (err, result) => {
      if (err) {
         res.send("Greska prilikom izvrsavanja upita: " + err);
      } else {
         res.send("Podaci o korisniku: " + JSON.stringify(result.rows));
      }

   });
});
router.put('/updateUser/:id', (req, res) => {
   const id = req.params.id;
   const username = req.body.username;
   const pass = req.body.pass;

   const update_query = 'UPDATE DnevnikUser SET username=$1 WHERE idnum=$2';
   con.query(update_query, [username, id], (err, result) => {
      if (err) {
         console.log("Greska prilikom azuriranja korisnika: " + err);
         res.status(500).send("Greska prilikom azuriranja korisnika");
      } else {
         console.log("Korisnik uspesno azuriran");
         res.status(200).send("Korisnik uspesno azuriran");
      }
   });
});
router.delete('/deleteUser/:id', (req, res) => {
   const id = req.params.id;
   const delete_query = 'DELETE FROM DnevnikUser WHERE idnum=$1';
   con.query(delete_query, [id], (err, result) => {
      if (err) {
         console.log("Greska prilikom brisanja korisnika: " + err);
         res.status(500).send("Greska prilikom brisanja korisnika");
      } else {
         console.log("Korisnik uspesno obrisan");
         res.status(200).send("Korisnik uspesno obrisan");
      }
   });
});
router.delete('/deleteAllUsers', (req, res) => {
   const delete_query = 'DELETE FROM DnevnikUser';
   con.query(delete_query, (err, result) => {
      if (err) {
         console.log("Greska prilikom brisanja svih korisnika: " + err);
         res.status(500).send("Greska prilikom brisanja svih korisnika");
      } else {
         console.log("Svi korisnici uspesno obrisani");
         res.status(200).send("Svi korisnici uspesno obrisani");
      }
   });
});





module.exports = router;
