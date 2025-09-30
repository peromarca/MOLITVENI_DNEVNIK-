const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
   // ✅ Inicijaliziraj kao običan objekt
   if (!req.session.users) {
      req.session.users = {};
   }
   res.render('register');
});

router.post('/register', (req, res) => {
   const { ime, email, pass, pass2 } = req.body;

   if (!ime || !email || !pass || !pass2) {
      return res.status(400).send('All fields are required');
   }

   if (pass !== pass2) {
      return res.status(400).send('Passwords do not match');
   }

   if (pass.length < 5) {
      return res.status(400).send('Password must be at least 5 characters long');
   }

   if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).send('Invalid email format');
   }

   // ✅ Inicijaliziraj session objekt
   if (!req.session.users) {
      req.session.users = {};
   }

   // ✅ Provjeri da li korisnik već postoji
   if (req.session.users[email]) {
      return res.status(400).send('User already exists');
   }

   // ✅ Dodaj korisnika u session
   req.session.users[email] = { ime, pass };

   res.redirect('/login');
});

module.exports = router;
