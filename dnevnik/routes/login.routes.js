const express = require('express');
const router = express.Router();

// Middleware funkcija za proveru da li je korisnik ulogovan
function requireAuth(req, res, next) {
   if (req.session && req.session.user) {
      return next(); // Korisnik je ulogovan, nastavi
   } else {
      return res.redirect('/login'); // Nije ulogovan, vrati na login
   }
}

// Middleware funkcija za proveru da li je korisnik već ulogovan (za login/register stranice)
function redirectIfLoggedIn(req, res, next) {
   if (req.session && req.session.user) {
      return res.redirect('/dashboard'); // Već ulogovan, vodi na dashboard
   } else {
      return next(); // Nije ulogovan, prikaži login/register
   }
}

router.get('/', (req, res) => {
   // Ako je korisnik ulogovan, vodi na dashboard, inače na index
   if (req.session && req.session.user) {
      res.redirect('/dashboard');
   } else {
      res.render('index', { user: null });
   }
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
   const success = req.query.success;
   res.render('login', { success, user: null });
});

router.get('/dashboard', requireAuth, (req, res) => {
   const user = req.session.user;
   res.render('userinterface', { user });
});

// Logout ruta
router.post('/logout', (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         return res.status(500).send('Could not log out');
      }
      res.redirect('/login');
   });
});


module.exports = router;
