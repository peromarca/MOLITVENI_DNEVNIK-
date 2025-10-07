const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
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


router.post('/dodajKorisnika', async (req, res) => {

   const { username, pass, idnum, email } = req.body;
   const hashpass = await bcrypt.hash(pass, 10);
   const insert_query = 'INSERT INTO DnevnikUser (username, hashpass, idnum, email) VALUES ($1, $2, $3, $4)';
   con.query(insert_query, [username, hashpass, idnum, email], (err, result) => {
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
router.put('/updateUser/:id', async (req, res) => {
   try {
      const id = req.params.id;
      const username = req.body.username;
      const pass = req.body.pass;

      let update_query, params;

      if (pass) {
         // Ako se menja i lozinka - hash je
         const hashpass = await bcrypt.hash(pass, 10);
         update_query = 'UPDATE DnevnikUser SET username=$1, hashpass=$2 WHERE idnum=$3';
         params = [username, hashpass, id];
      } else {
         // Ako se menja samo username
         update_query = 'UPDATE DnevnikUser SET username=$1 WHERE idnum=$2';
         params = [username, id];
      }

      con.query(update_query, params, (err, result) => {
         if (err) {
            console.log("Greska prilikom azuriranja korisnika: " + err);
            res.status(500).send("Greska prilikom azuriranja korisnika");
         } else {
            console.log("Korisnik uspesno azuriran");
            res.status(200).send("Korisnik uspesno azuriran");
         }
      });
   } catch (error) {
      res.status(500).send("Greska pri hashovanju lozinke");
   }
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

// Dodajte novu rutu za registraciju
router.post('/register', async (req, res) => {
   try {
      const { ime, email, pass, pass2 } = req.body;

      // Validacija podataka
      if (!ime || !email || !pass || !pass2) {
         return res.render('register', { error: "Sva polja su obavezna", ime: ime || '', email: email || '' });
      }

      if (pass !== pass2) {
         return res.render('register', { error: "Lozinke se ne poklapaju", ime: ime || '', email: email || '' });
      }

      if (pass.length < 6) {
         return res.render('register', { error: "Lozinka mora imati najmanje 6 karaktera", ime: ime || '', email: email || '' });
      }

      // Proveri da li korisnik već postoji
      const check_query = 'SELECT * FROM DnevnikUser WHERE email = $1 OR username = $2';
      con.query(check_query, [email, ime], async (err, result) => {
         if (err) {
            console.log("Greška prilikom provere korisnika: " + err);
            return res.render('register', { error: "Greška prilikom provere korisnika", ime: ime || '', email: email || '' });
         }

         if (result.rows.length > 0) {
            return res.render('register', { error: "Korisnik sa tim email-om već postoji", ime: ime || '', email: email || '' });
         }

         // Ako korisnik ne postoji, pronađi maksimalni idnum
         const max_query = 'SELECT MAX(idnum) as max_id FROM DnevnikUser';
         con.query(max_query, async (err, maxResult) => {
            if (err) {
               console.log("Greška prilikom pronalaska max idnum: " + err);
               return res.render('register', { error: "Greška prilikom generisanja ID-a", ime: ime || '', email: email || '' });
            }

            // Ako nema korisnika u bazi, počni od 1, inače max + 1
            const maxId = maxResult.rows[0].max_id;
            const newIdnum = maxId ? maxId + 1 : 1;

            // Dodaj korisnika sa novim idnum
            const hashpass = await bcrypt.hash(pass, 10);
            const insert_query = 'INSERT INTO DnevnikUser (username, hashpass, idnum,email ) VALUES ($1, $2, $3, $4)';

            con.query(insert_query, [ime, hashpass, newIdnum, email], (err, result) => {
               if (err) {
                  console.log("Greška prilikom registracije korisnika: " + err);
                  return res.render('register', { error: "Greška prilikom registracije", ime: ime || '', email: email || '' });
               } else {
                  console.log("Korisnik uspešno registrovan sa idnum: " + newIdnum);

                  // ✅ PREBACI NA LOGIN PAGE
                  return res.redirect('/login?success=registered');
               }
            });
         });
      });

   } catch (error) {
      console.log("Greška pri registraciji: " + error);
      return res.render('register', { error: "Serverska greška", ime: '', email: '' });
   }
});

router.post('/login', (req, res) => {
   const { email, pass } = req.body;
   if (!email || !pass) {
      return res.status(400).send('All fields are required');
   }
   if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).send('Invalid email format');
   }

   const check_query = 'SELECT * FROM DnevnikUser WHERE email = $1';
   con.query(check_query, [email], async (err, result) => {
      if (err) {
         console.log("Greška prilikom provere korisnika: " + err);
         return res.status(500).send('Server error');
      }

      if (result.rows.length === 0) {
         return res.render('login', { error: "Korisnik sa tim email-om ne postoji", pass: pass || '', email: email || '' });
      }
      if (await bcrypt.compare(pass, result.rows[0].hashpass)) {
         req.session.user = { id: result.rows[0].idnum, username: result.rows[0].username, email: result.rows[0].email };
         return res.redirect('/dashboard');
      }
      else {
         return res.render('login', { error: "Pogrešna lozinka", pass: pass || '', email: email || '' });
      }
   });


});




module.exports = router;
