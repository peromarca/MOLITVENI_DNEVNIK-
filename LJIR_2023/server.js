const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");

const LoginRoutes = require('./routes/login.routes');
const RegisterRoutes = require('./routes/register.routes');
app.use(session({
   secret: 'quiz-secret-key',
   resave: false,
   saveUninitialized: true,
   cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
   extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', RegisterRoutes);
app.use('/', LoginRoutes);




// sretno! :)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}!`);
})