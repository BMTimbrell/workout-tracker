const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
require("dotenv").config();

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

const checkValidEmail = async (req, res, next) => {
    const { email } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email))
        return res.status(400).json({error: 'invalid email'});
    next();
};

const checkValidName = async (req, res, next) => {
    const { name } = req.body;
    if (!name) 
        return response.status(400).json({error: 'invalid name'});
    next();
};

const checkValidPassword = async (req, res, next) => {
    const { password } = req.body;
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

const updateEmail = async (req, res) => {
    const { email } = req.body;

    try {
        await pool.query('UPDATE users SET email = $1 WHERE id = $2', 
        [email, parseInt(req.params.id)]);

        return res.status(200).json({message: 'email updated'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const updateName = async (req, res) => {
    const { name } = req.body;

    try {
        await pool.query('UPDATE users SET name = $1 WHERE id = $2', 
        [name, parseInt(req.params.id)]);

        return res.status(200).json({message: 'name updated'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const updatePassword = async (req, res) => {
    const { password, newPassword } = req.body;

    try {
        // compare password to current one in db for match
        const result = await pool.query('SELECT password FROM users WHERE id = $1', [parseInt(req.params.id)]);
        const oldPassword = await result.rows[0]?.password;

        const matchedPassword = await bcrypt.compare(password, oldPassword);

        if (!matchedPassword) {
            return res.status(400).json({message: "password doesn't match"});
        }

        // create new password hash and update in db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', 
        [hashedPassword, parseInt(req.params.id)]);

        return res.status(200).json({message: 'password updated'});
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
        return res.status(500).json({error});
    }
};

const getExerciseNameById = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const exercise = await pool.query(
            'SELECT exercises.id, exercises.user_id, exercises.name '
            + 'FROM exercises '
            + 'WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.id = $2 ', [userId, exerciseId]
        );

        return res.status(200).json(exercise.rows[0]);
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getExerciseNameBodypartById = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const exercise = await pool.query(
            'SELECT exercises.id, exercises.user_id, exercises.name, exercises.bodypart '
            + 'FROM exercises '
            + 'WHERE (exercises.user_id IS NULL OR exercises.user_id = $1) AND exercises.id = $2 ', [userId, exerciseId]
        );

        return res.status(200).json(exercise.rows[0]);
    } catch (error) {
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
                +    'FROM routine_sets'
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
                    routine.exercises = routine.exercises.map(exercise => {
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
                            [!isNaN(set.weight) ? Number(set.weight) : 0, !isNaN(set.reps) ? parseInt(set.reps) : 0]);
                        const setId = result.rows[0].id;
    
                        await pool.query('INSERT INTO routines_exercises (routine_id, exercise_id, exercise_order, set_id) VALUES ($1, $2, $3, $4)', 
                        [routineId, Number(exercise[0]), index, setId]);
                    } catch (error) {
                        return res.status(500).json({error});
                    }
                }
            }
        }

        return res.status(201).json({message: 'routine added'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const updateRoutine = async (req, res) => {
    const userId = parseInt(req.params.id);
    const routineId = parseInt(req.params.routineId);
    const { 
        name, 
        exercises,
        setsToDelete
    } = req.body;

    try {
        if (name) {
            await pool.query('UPDATE routines SET name = $1 WHERE id = $2 AND user_id = $3', [name, routineId, userId]);
        }

        for (const set of setsToDelete) {
            await pool.query('DELETE FROM routine_sets WHERE id = $1', [set]);
        }

        for (const [index, exercise] of exercises.entries()) {
            for (const set of exercise[1]) {
                if (set.id) {
                    await pool.query('UPDATE routine_sets SET weight = $1, reps = $2 WHERE id = $3', 
                        [!isNaN(set.weight) ? Number(set.weight) : 0, !isNaN(set.reps) ? parseInt(set.reps) : 0, set.id]);
                } else {
                    const result = await pool.query('INSERT INTO routine_sets (weight, reps) VALUES ($1, $2) RETURNING id', 
                            [!isNaN(set.weight) ? Number(set.weight) : 0, !isNaN(set.reps) ? parseInt(set.reps) : 0]);

                    set.id = result.rows[0].id;
                }

                await pool.query('INSERT INTO routines_exercises (routine_id, exercise_id, set_id, exercise_order) VALUES ($1, $2, $3, $4) '
                    +'ON CONFLICT (set_id) '
                    +'DO UPDATE SET exercise_order = $4', [routineId, exercise[0], set.id, index]);
            }
        }
        

        return res.status(200).json({message: 'routine updated'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const deleteRoutine = async (req, res) => {
    const userId = parseInt(req.params.id);
    const routineId = parseInt(req.params.routineId);

    try {
        const setIds = await pool.query('SELECT set_id FROM routines_exercises WHERE routine_id = $1', 
            [routineId]);
        
        setIds.rows.forEach(async set => {
            await pool.query('DELETE FROM routine_sets WHERE id = $1', [set.set_id]);
        });
        
        await pool.query('DELETE FROM routines WHERE user_id = $1 AND id = $2', 
        [userId, routineId]);

        return res.status(200).json({message: 'routine deleted'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getWorkouts = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const workouts = await pool.query(
            'WITH exercise_list AS ('
                +'SELECT workouts_exercises.workout_id, exercises.id, exercises.name, array_agg(sets ORDER BY sets.id) AS sets, workouts_exercises.exercise_order '
                +'FROM workouts_exercises '
                +'JOIN exercises ON workouts_exercises.exercise_id = exercises.id '
                +'JOIN ('
                +    'SELECT workout_sets.id, workout_sets.weight, workout_sets.reps, workout_sets.one_rep_max, workout_sets.best_set '
                +    'FROM workout_sets'
                +  ') sets ON sets.id = workouts_exercises.set_id '
                +'GROUP BY workouts_exercises.exercise_order, workouts_exercises.workout_id, exercises.id '
              +')'
              +'SELECT workouts.id, workouts.name, workouts.date, workouts.duration, json_agg(exercise_list ORDER BY exercise_list.exercise_order) AS exercises '
              +'FROM workouts '
              +'LEFT JOIN exercise_list ON exercise_list.workout_id = workouts.id '
              +'WHERE workouts.user_id = $1 '
              +'GROUP BY workouts.id '
              +'ORDER BY workouts.date DESC', [id]
        );

        if (workouts.rows.length > 0) {
            workouts.rows = workouts.rows.map(workout => {
                if (workout.exercises[0]) {
                    workout.exercises = workout.exercises.map(exercise => {
                        delete exercise["workout_id"];
                        delete exercise["exercise_order"];
                        return exercise;
                    });
                }
                return workout;
            });
        }

        return res.status(200).json({workouts: workouts.rows});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const addWorkout = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, time } = req.body;
    let { exercises } = req.body;

    const bestSetIndexes = [];

    exercises.forEach((exercise) => {
        let bestSetIndex = 0;
        const sets = exercise[1];

        sets.forEach((set, index) => {
            if (Number(set["1RM"]) > Number(sets[bestSetIndex]["1RM"])) {
                bestSetIndex = index;
            }
        });

        bestSetIndexes.push(bestSetIndex);
    });

    exercises = exercises.map((exercise, index) => {
        exercise[1][bestSetIndexes[index]].bestSet = true;
        return exercise;
    });

    try {

        const result = await pool.query('INSERT INTO workouts (user_id, name, date, duration) VALUES ($1, $2, $3, $4) RETURNING id', 
            [userId, name, time.start, time.duration]);
        const workoutId = result.rows[0].id;
        
        if (workoutId) {
            for (const [index, exercise] of exercises.entries()) {
                for (const set of exercise[1]) {
                    try {
                        const result = await pool.query(
                            'INSERT INTO workout_sets (weight, reps, one_rep_max, best_set) VALUES ($1, $2, $3, $4) RETURNING id', 
                            [
                                !isNaN(set.weight) ? Number(set.weight) : 0, 
                                !isNaN(set.reps) ? parseInt(set.reps) : 0, 
                                Math.round(Number(set["1RM"])), 
                                set?.bestSet ? set.bestSet : false
                            ]
                        );

                        const setId = result.rows[0].id;
    
                        await pool.query('INSERT INTO workouts_exercises (workout_id, exercise_id, exercise_order, set_id) VALUES ($1, $2, $3, $4)', 
                        [workoutId, Number(exercise[0]), index, setId]);
                    } catch (error) {
                        return res.status(500).json({error});
                    }
                }
            }
        }

        return res.status(201).json({message: 'workout added'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getNumberRoutinesByExercise = async (req, res) => {
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const routines = await pool.query(
            'WITH routine_list AS ('
            +'SELECT COUNT(routine_id) '
            +'FROM routines_exercises '
            +'WHERE exercise_id = $1 '
            +'GROUP BY routine_id'
          +')'
          +'SELECT COUNT(*) FROM routine_list', [exerciseId]
        );

        return res.status(200).json({count: routines.rows[0].count});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getNumberWorkoutsByExercise = async (req, res) => {
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const workouts = await pool.query(
            'WITH workout_list AS ('
            +'SELECT COUNT(workout_id) '
            +'FROM workouts_exercises '
            +'WHERE exercise_id = $1 '
            +'GROUP BY workout_id'
          +')'
          +'SELECT COUNT(*) FROM workout_list', [exerciseId]
        );

        return res.status(200).json({count: workouts.rows[0].count});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getWorkoutSetsByExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const workouts = await pool.query(
            'SELECT workouts.id, workouts.name, workouts.date, json_agg(sets ORDER BY sets.id) AS sets '
            +'FROM workouts '
            +'JOIN workouts_exercises ON workouts.id = workouts_exercises.workout_id '
            +'JOIN ('
                +'SELECT workout_sets.id, workout_sets.weight, workout_sets.reps, workout_sets.one_rep_max '
                +'FROM workout_sets'
            +') sets ON sets.id = workouts_exercises.set_id '
            +'WHERE workouts_exercises.exercise_id = $1 AND workouts.user_id = $2 '
            +'GROUP BY workouts.id '
            +'ORDER BY workouts.date DESC', [exerciseId, userId]
        );

        return res.status(200).json({workouts: workouts.rows});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getBestSetsByExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const sets = await pool.query(
            'SELECT DISTINCT workouts.date, workout_sets.one_rep_max, workout_sets.weight, workout_sets.reps '
            +'FROM workouts '
            +'JOIN workouts_exercises ON workouts.id = workouts_exercises.workout_id '
            +'JOIN workout_sets ON workout_sets.id = workouts_exercises.set_id '
            +'WHERE workouts_exercises.exercise_id = $1 AND workouts.user_id = $2 AND workout_sets.best_set = TRUE '
            +'ORDER BY workouts.date', [exerciseId, userId]
        );

        return res.status(200).json({sets: sets.rows});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const updateWorkout = async (req, res) => {
    const userId = parseInt(req.params.id);
    const workoutId = parseInt(req.params.workoutId);
    const { 
        name, 
        setsToDelete
    } = req.body;

    let { exercises } = req.body;

    const bestSetIndexes = [];

    exercises.forEach((exercise) => {
        let bestSetIndex = 0;
        const sets = exercise[1];

        sets.forEach((set, index) => {
            if (Number(set["1RM"]) > Number(sets[bestSetIndex]["1RM"])) {
                bestSetIndex = index;
            }
        });

        bestSetIndexes.push(bestSetIndex);
    });

    exercises = exercises.map((exercise, index) => {
        exercise[1][bestSetIndexes[index]].bestSet = true;
        return exercise;
    });

    try {

        if (name) {
            await pool.query('UPDATE workouts SET name = $1 WHERE id = $2 AND user_id = $3', [name, workoutId, userId]);
        }

        for (const set of setsToDelete) {
            await pool.query('DELETE FROM workout_sets WHERE id = $1', [set]);
        }

        for (const [index, exercise] of exercises.entries()) {
            for (const set of exercise[1]) {
                if (set.id) {
                    await pool.query('UPDATE workout_sets SET weight = $1, reps = $2, one_rep_max = $3, best_set = $4 WHERE id = $5', 
                        [
                            !isNaN(set.weight) ? Number(set.weight) : 0, 
                            !isNaN(set.reps) ? parseInt(set.reps) : 0, 
                            Math.round(Number(set["1RM"])), 
                            set?.bestSet ? set.bestSet : false,
                            set.id
                        ]
                    );
                } else {
                    const result = await pool.query('INSERT INTO workout_sets (weight, reps, one_rep_max, best_set) VALUES ($1, $2, $3, $4) RETURNING id', 
                        [
                            !isNaN(set.weight) ? Number(set.weight) : 0, 
                            !isNaN(set.reps) ? parseInt(set.reps) : 0, 
                            Math.round(Number(set["1RM"])), 
                            set?.bestSet ? set.bestSet : false
                        ]
                    );

                    set.id = result.rows[0].id;
                }

                await pool.query('INSERT INTO workouts_exercises (workout_id, exercise_id, set_id, exercise_order) VALUES ($1, $2, $3, $4) '
                    +'ON CONFLICT (set_id) '
                    +'DO UPDATE SET exercise_order = $4', [workoutId, exercise[0], set.id, index]);
            }
        }
        

        return res.status(200).json({message: 'workout updated'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const deleteWorkout = async (req, res) => {
    const userId = parseInt(req.params.id);
    const workoutId = parseInt(req.params.workoutId);

    try {
        const setIds = await pool.query('SELECT set_id FROM workouts_exercises WHERE workout_id = $1', 
            [workoutId]);
        
        setIds.rows.forEach(async set => {
            await pool.query('DELETE FROM workout_sets WHERE id = $1', [set.set_id]);
        });
        
        await pool.query('DELETE FROM workouts WHERE user_id = $1 AND id = $2', 
        [userId, workoutId]);

        return res.status(200).json({message: 'workout deleted'});
    } catch (error) {
        return res.status(500).json({error});
    }
};

const getRecentSetsByExercise = async (req, res) => {
    const userId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    try {
        const sets = await pool.query('SELECT workout_sets.weight, workout_sets.reps '
            +'FROM workout_sets '
            +'JOIN workouts_exercises ON workouts_exercises.set_id = workout_sets.id '
            +'JOIN workouts ON workouts.id = workouts_exercises.workout_id '
            +'JOIN ('
            +  'SELECT MAX(workouts.date) '
            +  'FROM workouts '
            +  'JOIN workouts_exercises ON workouts.id = workouts_exercises.workout_id '
            +  'WHERE workouts_exercises.exercise_id = $2 AND workouts.user_id = $1'
            +') latest_date ON workouts.date = latest_date.max '
            +'WHERE workouts_exercises.exercise_id = $2 AND workouts.user_id = $1 '
            +'ORDER BY workout_sets.id', 
        [userId, exerciseId]);

        return res.status(200).json({sets: sets.rows});
    } catch (error) {
        return res.status(500).json({error});
    }
};


module.exports = {
    checkUserAuthorised,
    getUserById,
    checkEmailExists,
    checkValidEmail,
    checkValidName,
    checkValidPassword,
    updateEmail,
    updateName,
    updatePassword,
    createUser,
    getExercises,
    getBodyParts,
    searchExercises,
    getExerciseById,
    getExerciseNameById,
    getExerciseNameBodypartById,
    addExercise,
    updateExercise,
    deleteExercise,
    getRoutines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    addWorkout,
    getWorkouts,
    getNumberRoutinesByExercise,
    getNumberWorkoutsByExercise,
    getWorkoutSetsByExercise,
    getBestSetsByExercise,
    updateWorkout,
    deleteWorkout,
    getRecentSetsByExercise
};