const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
   // ✅ Inicijaliziraj kao običan objekt
   if (!req.session.users) {
      req.session.users = {};
   }
   res.render('register');
});




module.exports = router;
