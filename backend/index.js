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
    origin: process.env.PORT ? 'https://workout-tracker-nzvi.onrender.com' : 'http://localhost:3000',
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
app.put('/users/:id/email', db.checkUserAuthorised, db.checkValidEmail, db.checkEmailExists, db.updateEmail);
app.put('/users/:id/name', db.checkUserAuthorised, db.checkValidName, db.updateName);
app.put('/users/:id/password', db.checkUserAuthorised, db.checkValidPassword, db.updatePassword);
app.post('/register', db.checkValidEmail, db.checkValidName, db.checkValidPassword, db.checkEmailExists, db.createUser);
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
app.get('/users/:id/exercises/:exerciseId/name/bodypart', db.checkUserAuthorised, db.getExerciseNameBodypartById);

app.get('/users/:id/exercises/:exerciseId/routines', db.checkUserAuthorised, db.getNumberRoutinesByExercise);
app.get('/users/:id/exercises/:exerciseId/workouts', db.checkUserAuthorised, db.getNumberWorkoutsByExercise);

app.get('/users/:id/exercises/:exerciseId/workouts/sets', db.checkUserAuthorised, db.getWorkoutSetsByExercise);
app.get('/users/:id/exercises/:exerciseId/workouts/recent', db.checkUserAuthorised, db.getRecentSetsByExercise);
app.get('/users/:id/exercises/:exerciseId/workouts/best', db.checkUserAuthorised, db.getBestSetsByExercise);

app.get('/users/:id/routines', db.checkUserAuthorised, db.getRoutines);
app.post('/users/:id/routines', db.checkUserAuthorised, db.addRoutine);
app.put('/users/:id/routines/:routineId', db.checkUserAuthorised, db.updateRoutine);
app.delete('/users/:id/routines/:routineId', db.checkUserAuthorised, db.deleteRoutine);

app.get('/users/:id/workouts', db.checkUserAuthorised, db.getWorkouts);
app.post('/users/:id/workouts', db.checkUserAuthorised, db.addWorkout);
app.put('/users/:id/workouts/:workoutId', db.checkUserAuthorised, db.updateWorkout);
app.delete('/users/:id/workouts/:workoutId', db.checkUserAuthorised, db.deleteWorkout);

app.all('*', async (req, res) => {
    try {
        res.status(404).json({
            message: 'No routes matched your request'
        })
    } catch (e) {
        return res.status(500).json({error});
    }
});