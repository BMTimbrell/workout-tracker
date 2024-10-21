const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const passport = require('passport');
const session = require('express-session');
const db = require('./queries');

app.use(
    session({
        secret: 'asdawac21',
        cookie: { 
            maxAge: 300000000,
            sameSite: true,
            secure: true
        },
        resave: true,
        saveUninitialized: true
    })
);

app.use(cors({
    origin: 'https://localhost/3000',
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });

});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

app.get('/users/:id', db.checkUserAuthorised, db.getUserById);
// app.put('/users/:id', db.checkUserAuthorised, db.checkEmailExists, db.updateUser);
// app.post('/register', db.checkEmailExists, db.createUser);
app.post('/login', passport.authenticate('local', {failureRedirect: '/loginfailed', failureMessage: true}), 
    (req, res) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.redirect(303, "../users/" + req.user.id);
    }
);
app.get('/loginfailed', (req, res) => {
    res.status(401).json({ message: 'login failed' });
});
app.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        res.status(200).json({message: 'logout successful'});
    });
});