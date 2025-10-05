const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.redirect('/login');

});

router.get('/login', (req, res) => {
   const success = req.query.success;
   res.render('login', { success });
});

router.post('/login', (req, res) => {
   const { email, pass } = req.body;
   if (!email || !pass) {
      return res.status(400).send('All fields are required');
   }
   if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).send('Invalid email format');
   }
   if (!req.session.users || !req.session.users[email]) {
      return res.status(400).send('User does not exist');
   }
   if (req.session.users[email].pass !== pass) {
      return res.status(400).send('Incorrect password');
   }
   if (req.session.users[email].pass = pass) {
      return res.status(200).send('Login successful');
   }
});
module.exports = router;
