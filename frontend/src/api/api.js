const baseUrl = 'http://localhost:3001';

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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        console.log(error);
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
        
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};