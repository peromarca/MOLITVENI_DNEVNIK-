const { Client } = require('pg')
const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())
const path = require('path');
const session = require("express-session");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
   extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
   secret: 'quiz-secret-key',
   resave: false,
   saveUninitialized: true,
   cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
const BazaUserRoutes = require('./routes/bazauser.routes');
const LoginRoutes = require('./routes/login.routes');
const RegisterRoutes = require('./routes/register.routes');




app.use('/', BazaUserRoutes);
app.use('/', LoginRoutes);
app.use('/', RegisterRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server je pokrenut na portu ${PORT}`);
});




//https://www.youtube.com/watch?v=CL_cvH9OpOc&t=171s