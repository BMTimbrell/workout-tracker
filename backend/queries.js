const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
require("dotenv").config();

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

const checkInputValid = async (req, res, next) => {
    const { email, name, password } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
        return res.status(400).json({error: 'invalid email'});
    if (!name) 
        return response.status(400).json({error: 'invalid name'});
    if (!password)
        return response.status(400).json({error: 'invalid password'});
    next();
};

const checkEmailExists = async (req, res, next) => {
    const { email } = req.body;

    try {
        const isRegistered = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (isRegistered.rows.length) 
            return res.status(409).json({message: 'user already registered with this email'});
        next();
    } catch (error) {
        return res.status(500).json({error});
    }
};

const createUser = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await pool.query('INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *', 
        [email, name, hashedPassword]);

        req.login(user.rows[0], function(error) {
            if (error) return res.status(500).json({message: error.message}); 
            return res.status(201).json({message: 'registration successful'});
        });
    } catch (error) {
        return res.status(500).json({error});
    }
};

//Logging in
passport.use(new LocalStrategy({ usernameField: 'email' }, function verify(email, password, done) {
    pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, user) => {
        if (error) return done(error);
        if (!user.rows) {
            return done(new Error('User doesn\'t exist!'));
        }

        //Check passwords match
        try {
            const matchedPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!matchedPassword) return done(new Error('Incorrect password!'));
            return done(null, user.rows[0]);
        } catch (error) {
            return done(error);
        }
        
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) return done(error);
        return done(null, results.rows[0]);
    });
});

const checkUserAuthorised = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (parseInt(req?.user?.id) === id) next();
    else return res.status(401).json({error: 'You must be logged in as this user to access this resource'});
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
        const user = await result.rows[0];
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({error});
    }
};

module.exports = {
    checkUserAuthorised,
    getUserById,
    checkEmailExists,
    createUser
};