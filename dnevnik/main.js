const { Client } = require('pg');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session konfiguracija
app.use(session({
   secret: 'molitveni-dnevnik-secret-2025',
   resave: false,
   saveUninitialized: false,
   cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 sata
}));

// EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Middleware za proveru autentifikacije
function requireAuth(req, res, next) {
   if (req.session && req.session.userId) {
      return next();
   } else {
      return res.redirect('/login');
   }
}

// HOME ROUTE - redirect na login
app.get('/', (req, res) => {
   if (req.session && req.session.userId) {
      res.redirect('/dashboard');
   } else {
      res.redirect('/login');
   }
});

// LOGIN ROUTES
app.get('/login', (req, res) => {
   if (req.session && req.session.userId) {
      return res.redirect('/dashboard');
   }
   res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
   const { username, password } = req.body;

   try {
      const result = await con.query('SELECT * FROM DnevnikUser WHERE username = $1', [username]);

      if (result.rows.length === 0) {
         return res.render('login', { error: 'Pogrešno korisničko ime ili lozinka' });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.pass);

      if (!passwordMatch) {
         return res.render('login', { error: 'Pogrešno korisničko ime ili lozinka' });
      }

      // Uspešna prijava
      req.session.userId = user.idnum;
      req.session.username = user.username;
      res.redirect('/dashboard');

   } catch (err) {
      console.error('Greška pri prijavi:', err);
      res.render('login', { error: 'Greška na serveru. Pokušajte ponovo.' });
   }
});

// REGISTER ROUTES
app.get('/register', (req, res) => {
   if (req.session && req.session.userId) {
      return res.redirect('/dashboard');
   }
   res.render('register', { error: null, success: null });
});

app.post('/register', async (req, res) => {
   const { username, password, confirmPassword } = req.body;

   // Validacija
   if (!username || !password || !confirmPassword) {
      return res.render('register', { error: 'Sva polja su obavezna', success: null });
   }

   if (password !== confirmPassword) {
      return res.render('register', { error: 'Lozinke se ne poklapaju', success: null });
   }

   if (password.length < 6) {
      return res.render('register', { error: 'Lozinka mora imati najmanje 6 karaktera', success: null });
   }

   try {
      // Proveri da li korisnik već postoji
      const existingUser = await con.query('SELECT * FROM DnevnikUser WHERE username = $1', [username]);

      if (existingUser.rows.length > 0) {
         return res.render('register', { error: 'Korisničko ime već postoji', success: null });
      }

      // Šifriraj lozinku
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generiraj novi ID
      const maxIdResult = await con.query('SELECT MAX(idnum) as max_id FROM DnevnikUser');
      const newId = (maxIdResult.rows[0].max_id || 0) + 1;

      // Dodaj novog korisnika
      await con.query(
         'INSERT INTO DnevnikUser (username, pass, idnum) VALUES ($1, $2, $3)',
         [username, hashedPassword, newId]
      );

      res.render('register', {
         error: null,
         success: 'Uspešno ste se registrovali! Možete se prijaviti.'
      });

   } catch (err) {
      console.error('Greška pri registraciji:', err);
      res.render('register', { error: 'Greška na serveru. Pokušajte ponovo.', success: null });
   }
});

// DASHBOARD ROUTE
app.get('/dashboard', requireAuth, async (req, res) => {
   try {
      const result = await con.query('SELECT * FROM DnevnikUser WHERE idnum = $1', [req.session.userId]);
      const user = result.rows[0];
      res.render('dashboard', { user });
   } catch (err) {
      console.error('Greška pri učitavanju dashboarda:', err);
      res.redirect('/login');
   }
});

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         console.error('Greška pri odjavi:', err);
      }
      res.redirect('/login');
   });
});

// API ENDPOINTS (za administratore)
app.get('/api/users', requireAuth, async (req, res) => {
   try {
      const result = await con.query('SELECT idnum, username, created_at FROM DnevnikUser ORDER BY idnum');
      res.json({
         success: true,
         users: result.rows
      });
   } catch (err) {
      console.error('Greška pri dohvatanju korisnika:', err);
      res.status(500).json({
         success: false,
         error: 'Greška na serveru'
      });
   }
});


// API endpoint za dodavanje korisnika (preko registracije se koristi)
app.post('/api/add-user', requireAuth, async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
      return res.status(400).json({
         success: false,
         error: 'Username i password su obavezni'
      });
   }

   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const maxIdResult = await con.query('SELECT MAX(idnum) as max_id FROM DnevnikUser');
      const newId = (maxIdResult.rows[0].max_id || 0) + 1;

      await con.query(
         'INSERT INTO DnevnikUser (username, pass, idnum) VALUES ($1, $2, $3)',
         [username, hashedPassword, newId]
      );

      res.json({
         success: true,
         message: 'Korisnik uspešno dodat',
         userId: newId
      });

   } catch (err) {
      console.error('Greška pri dodavanju korisnika:', err);
      res.status(500).json({
         success: false,
         error: 'Greška na serveru'
      });
   }
});

app.get('/fetchId/:id', (req, res) => {
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
app.put('/updateUser/:id', (req, res) => {
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
app.delete('/deleteUser/:id', (req, res) => {
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
app.delete('/deleteAllUsers', (req, res) => {
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

app.listen(3000, () => {
   console.log("Server je pokrenut na portu 3000");
});




//https://www.youtube.com/watch?v=CL_cvH9OpOc&t=171s