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
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
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

        await pool.query('INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *', 
        [email, name, hashedPassword]);

        return res.status(201).json({message: 'registration successful'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

//Logging in
passport.use(new LocalStrategy({ usernameField: 'email' }, function verify(email, password, done) {
    pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, user) => {
        if (error) return done(error);

        if (!user.rows.length) {
            return done(null, false);
        }

        //Check passwords match
        try {
            const matchedPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!matchedPassword) return done(null, false);
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
    else return res.status(401).json({message: 'You must be logged in as this user to access this resource'});
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

const getExercises = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const exercises = await pool.query(
            'SELECT id, name, bodypart, description, user_id '
            + 'FROM exercises '
            + 'WHERE exercises.user_id IS NULL OR exercises.user_id = $1 '
            + 'ORDER BY LOWER(exercises.name)', [id]
        );

        return res.status(200).json({exercises: exercises.rows});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};

const getBodyParts = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const bodyparts = await pool.query(
            'SELECT DISTINCT bodypart '
            + 'FROM exercises '
            + "WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.bodypart <> 'Other'"
            + 'ORDER BY bodypart', [id]
        );

        const result = bodyparts.rows.map(el => el.bodypart);

        return res.status(200).json({bodyparts: result});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};


const searchExercises = async (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.query.name;
    const bodypart = req.query.bodypart;
    let exercises = {exercises: []};

    try {
        if (bodypart && name) {
            exercises = await pool.query(
                'SELECT exercises.id, exercises.user_id, exercises.name, exercises.bodypart, exercises.description '
                + 'FROM exercises '
                + "WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND LOWER(exercises.name) LIKE LOWER($2) AND exercises.bodypart = $3 "
                + 'ORDER BY LOWER(exercises.name)', [id, "%" + name + "%", bodypart]
            );
        } else if (name) {
            exercises = await pool.query(
                'SELECT exercises.id, exercises.user_id, exercises.name, exercises.bodypart, exercises.description '
                + 'FROM exercises '
                + "WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND LOWER(exercises.name) LIKE LOWER($2) "
                + 'ORDER BY LOWER(exercises.name)', [id, "%" + name + "%"]
            );
        } else if (bodypart) {
            exercises = await pool.query(
                'SELECT exercises.id, exercises.user_id, exercises.name, exercises.bodypart, exercises.description '
                + 'FROM exercises '
                + "WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.bodypart = $2 "
                + 'ORDER BY LOWER(exercises.name)', [id, bodypart]
            );
        }

        return res.status(200).json({exercises: exercises.rows});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};

const getExerciseById = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const exercise = await pool.query(
            'SELECT exercises.id, exercises.user_id, exercises.name, exercises.bodypart, exercises.description, array_agg(muscles.name) as muscles, array_agg(muscles_exercises.primary_muscle) as primary_muscles '
            + 'FROM exercises '
            + 'INNER JOIN muscles_exercises ON muscles_exercises.exercise_id = exercises.id '
            + 'INNER JOIN muscles ON muscles.id = muscles_exercises.muscle_id '
            + 'WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.id = $2 '
            + 'GROUP BY exercises.id ', [userId, exerciseId]
        );

        const muscles = exercise.rows[0].muscles;
        const primaryMuscles = exercise.rows[0].primary_muscles;
        const newMuscles = [];

        for (let i = 0; i < muscles.length; i++) {
            if (primaryMuscles[i]) {
                newMuscles.push([muscles[i], "primary"]);
            } else {
                newMuscles.push([muscles[i], "secondary"]);
            }
        }

        newMuscles.sort((a, b) => {
            if (a[1] === b[1]) {
                return 0;
            } else {
                return a[1] === "primary" ? -1 : 1;
            }
        });

        delete exercise.rows[0].muscles;
        delete exercise.rows[0].primary_muscles;
        exercise.rows[0].muscles = newMuscles;

        return res.status(200).json(exercise.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};

const getExerciseNameById = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const exercise = await pool.query(
            'SELECT exercises.id, exercises.name '
            + 'FROM exercises '
            + 'WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.id = $2 ', [userId, exerciseId]
        );

        return res.status(200).json(exercise.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};

const addExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, bodypart } = req.body;

    try {
        await pool.query('INSERT INTO exercises (name, bodypart, user_id) VALUES ($1, $2, $3)', 
        [name, bodypart, userId]);

        return res.status(201).json({message: 'exercise added'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const updateExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);
    const { name, bodypart } = req.body;

    try {
        await pool.query('UPDATE exercises SET name = $1, bodypart = $2 WHERE user_id = $3 AND id = $4', 
        [name, bodypart, userId, exerciseId]);

        return res.status(200).json({message: 'exercise updated'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const deleteExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        await pool.query('DELETE FROM exercises WHERE user_id = $1 AND id = $2', 
        [userId, exerciseId]);

        return res.status(200).json({message: 'exercise deleted'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getRoutines = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const routines = await pool.query(
            'WITH exercise_list AS ('
                +'SELECT routines_exercises.routine_id, exercises.id, exercises.name, array_agg(sets ORDER BY sets.id) AS sets, routines_exercises.exercise_order '
                +'FROM routines_exercises '
                +'JOIN exercises ON routines_exercises.exercise_id = exercises.id '
                +'JOIN ('
                +    'SELECT routine_sets.id, routine_sets.weight, routine_sets.reps '
                +    'FROM routine_sets ORDER BY routine_sets.id'
                +  ') sets ON sets.id = routines_exercises.set_id '
                +'GROUP BY routines_exercises.exercise_order, routines_exercises.routine_id, exercises.id '
              +')'
              +'SELECT routines.id, routines.name, json_agg(exercise_list ORDER BY exercise_list.exercise_order) AS exercises '
              +'FROM routines '
              +'LEFT JOIN exercise_list ON exercise_list.routine_id = routines.id '
              +'WHERE routines.user_id = $1 '
              +'GROUP BY routines.id', [id]
        );

        if (routines.rows.length > 0) {
            routines.rows = routines.rows.map(routine => {
                if (routine.exercises[0]) {
                    routine.exericses = routine.exercises.map(exercise => {
                        delete exercise["routine_id"];
                        delete exercise["exercise_order"];
                        return exercise;
                    });
                }
                return routine;
            });
        }

        return res.status(200).json({routines: routines.rows});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};

const addRoutine = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, exercises } = req.body;

    try {
        const addRoutine = async () => {
            try {
                const result = await pool.query('INSERT INTO routines (user_id, name) VALUES ($1, $2) RETURNING id', [userId, name]);
                return result.rows[0].id;
            } catch (error) {
                return res.status(500).json({error});
            }
        };
        const routineId = await addRoutine();
        
        if (routineId) {
            for (const [index, exercise] of exercises.entries()) {
                for (const set of exercise[1]) {
                    try {
                        const result = await pool.query('INSERT INTO routine_sets (weight, reps) VALUES ($1, $2) RETURNING id', 
                            [!isNaN(set.weight) ? Number(set.weight) : null, !isNaN(set.reps) ? Number(set.reps) : null]);
                        const setId = result.rows[0].id;
    
                        await pool.query('INSERT INTO routines_exercises (routine_id, exercise_id, exercise_order, set_id) VALUES ($1, $2, $3, $4)', 
                        [routineId, Number(exercise[0]), index, setId]);
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({error});
                    }
                }
            }
        }

        return res.status(201).json({message: 'routine added'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
};



module.exports = {
    checkUserAuthorised,
    getUserById,
    checkEmailExists,
    checkInputValid,
    createUser,
    getExercises,
    getBodyParts,
    searchExercises,
    getExerciseById,
    getExerciseNameById,
    addExercise,
    updateExercise,
    deleteExercise,
    getRoutines,
    addRoutine
};