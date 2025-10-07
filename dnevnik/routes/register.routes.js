const express = require('express');
const router = express.Router();

// Middleware funkcija za proveru da li je korisnik već ulogovan (za login/register stranice)
function redirectIfLoggedIn(req, res, next) {
   if (req.session && req.session.user) {
      return res.redirect('/dashboard'); // Već ulogovan, vodi na dashboard
   } else {
      return next(); // Nije ulogovan, prikaži login/register
   }
}

router.get('/register', redirectIfLoggedIn, (req, res) => {
   res.render('register');
});




module.exports = router;
