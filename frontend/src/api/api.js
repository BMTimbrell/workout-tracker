import { convertToKg } from "../utils/utils";

const baseUrl = 'https://workout-tracker-nzvi.onrender.com/api';

export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
        });

        if (response.status >= 500) return null;
        
        return response.json();
    } catch (error) {
        return null;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status >= 500) return null;

        return response.json();
    } catch (error) {
        return null;
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetch(`${baseUrl}/logout`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        
        return response.json();

    } catch (error) {
        return null;
    }
};

export const fetchUser = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        
        if (response.ok) return response.json();

        return null;
    } catch (error) {
        return null;
    }
};

export const updateName = async (id, name) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/name`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                name
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status >= 500) return null;
        
        if (response.status === 401) return { authorisationFailed: true };
        
        return response.json();
    } catch (error) {
        return null;
    }
};

export const updateEmail = async (id, email) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/email`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                email
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status >= 500) return null;
        
        if (response.status === 401) return { authorisationFailed: true };
        
        return response.json();
    } catch (error) {
        return null;
    }
};

export const updatePassword = async (id, password, newPassword) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/password`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                password,
                newPassword
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status >= 500) return null;
        
        if (response.status === 401) return { authorisationFailed: true };
        
        return response.json();
    } catch (error) {
        return null;
    }
};

export const getExercises = async (id, controller) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/exercises`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });
        
        if (response.ok) return response.json();
        else if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        if (!controller.signal.aborted) {
            return null;   
        }
    }
};

export const searchExercises = async (id, name, bodypart, controller) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/exercises/search?name=${name}&bodypart=${bodypart}`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });

        if (response.ok) return response.json();
        else if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        if (!controller.signal.aborted) {
            return null;   
        }
    }
};

export const getBodyParts = async (id, controller) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/exercises/bodyparts`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });
        
        if (response.ok) return response.json();

        return null;
    } catch (error) {
        if (!controller.signal.aborted) {
            return null;   
        }
    }
};

export const addExercise = async (userId, name, bodypart) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/exercises`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                name,
                bodypart
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const editExercise = async (userId, exerciseId, name, bodypart) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/exercises/${exerciseId}`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                name,
                bodypart
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const deleteExercise = async (userId, exerciseId) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/exercises/${exerciseId}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getNumberRoutinesByExercise = async (userId, exerciseId) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/exercises/${exerciseId}/routines`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        return null
    }
};

export const getNumberWorkoutsByExercise = async (userId, exerciseId) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/exercises/${exerciseId}/workouts`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        return null
    }
};

export const getRoutines = async (id, controller) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/routines`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        if (!controller.signal.aborted) {
            return null;   
        } else {
            return { abortError: true };
        }
    }
};

export const addRoutine = async (id, name, exercises, units) => {
    if (units === "lbs") {
        exercises.map(exercise => {
            exercise[1] = exercise[1].map(set => {
                set.weight = convertToKg(set.weight);
                return set;
            });
            return exercise;
        });
    }

    try {
        const response = await fetch(`${baseUrl}/users/${id}/routines`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                exercises
            }),
            credentials: "include"
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        return null;
    }
};

export const deleteRoutine = async (userId, routineId) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/routines/${routineId}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        return null;
    }
};

export const editRoutine = async (userId, routineId, name, exercises, setsToDelete, units) => {

    if (units === "lbs") {
        exercises = exercises.map(exercise => {
            exercise[1] = exercise[1].map(set => {
                set.weight = convertToKg(set.weight);
                return set;
            });
            return exercise;
        });
    }

    try {
        const response = await fetch(`${baseUrl}/users/${userId}/routines/${routineId}`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                name,
                exercises,
                setsToDelete
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        return null;
    }
};

export const getWorkouts = async (id, controller) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/workouts`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        if (!controller.signal.aborted) {
            return null;   
        } else {
            return { abortError: true };
        }
    }
};

export const addWorkout = async (id, name, exercises, time, units) => {
    if (units === "lbs") {
        exercises = exercises.map(exercise => {
            exercise[1] = exercise[1].map(set => {
                set.weight = convertToKg(set.weight);
                set["1RM"] = convertToKg(set["1RM"]);
                return set;
            });
            return exercise;
        });
    }


    try {
        const response = await fetch(`${baseUrl}/users/${id}/workouts`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                exercises,
                time
            }),
            credentials: "include"
        });
        
        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };

        return null;
    } catch (error) {
        return null;
    }
};

export const editWorkout = async (userId, workoutId, name, exercises, setsToDelete, unit) => {
    if (unit === "lbs") {
        exercises = exercises.map(exercise => {
            exercise[1] = exercise[1].map(set => {
                set.weight = convertToKg(set.weight);
                set["1RM"] = convertToKg(set["1RM"]);
                return set;
            });
            return exercise;
        });
    }


    try {
        const response = await fetch(`${baseUrl}/users/${userId}/workouts/${workoutId}`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                name,
                exercises,
                setsToDelete
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        return null;
    }
};

export const deleteWorkout = async (userId, workoutId) => {
    try {
        const response = await fetch(`${baseUrl}/users/${userId}/workouts/${workoutId}`, {
            method: 'DELETE',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.ok) return response.json();
        if (response.status === 401) return { authorisationFailed: true };
        
        return null;
    } catch (error) {
        return null;
    }
};