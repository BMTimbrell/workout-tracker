import React, { useContext } from 'react';
import useLocalStorage from './useLocalStorage';

const UserContext = React.createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const { value: user, setValue: setUser, removeValue: removeUser } = useLocalStorage('user');

    return (
        <UserContext.Provider value={{user, setUser, removeUser}}>
            { children }
        </UserContext.Provider>
    );
}