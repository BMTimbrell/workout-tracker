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
        secret: 'afgafaca',
        cookie: { 
            maxAge: 80000000,
            sameSite: process.env.PORT ? 'none' : 'lax',
            secure: process.env.PORT ? true : 'auto'
        },
        resave: true,
        saveUninitialized: true
    })
);

app.use(cors({
    origin: 'http://localhost:3000',
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
app.post('/register', db.checkInputValid, db.checkEmailExists, db.createUser);
app.post('/login', passport.authenticate('local', { failureRedirect: '/loginfailed', failureMessage: true }), 
    (req, res) => {
        res.status(200).send({ id: req.user.id });
    }
);
app.get('/loginfailed', (req, res) => {
    res.status(401).json({ message: 'wrong password' });
});
app.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        res.status(200).json({ message: 'logout successful' });
    });
});

app.get('/users/:id/exercises', db.checkUserAuthorised, db.getExercises);
app.post('/users/:id/exercises', db.checkUserAuthorised, db.addExercise);

app.get('/users/:id/exercises/bodyparts', db.checkUserAuthorised, db.getBodyParts);
app.get('/users/:id/exercises/search', db.checkUserAuthorised, db.searchExercises);
app.get('/users/:id/exercises/:exerciseId', db.checkUserAuthorised, db.getExerciseById);
app.put('/users/:id/exercises/:exerciseId', db.checkUserAuthorised, db.updateExercise);
app.delete('/users/:id/exercises/:exerciseId', db.checkUserAuthorised, db.deleteExercise);

app.get('/users/:id/exercises/:exerciseId/name', db.checkUserAuthorised, db.getExerciseNameById);

app.get('/users/:id/routines', db.checkUserAuthorised, db.getRoutines);
app.post('/users/:id/routines', db.checkUserAuthorised, db.addRoutine);
app.put('/users/:id/routines/:routineId', db.checkUserAuthorised, db.updateRoutine);
app.delete('/users/:id/routines/:routineId', db.checkUserAuthorised, db.deleteRoutine);