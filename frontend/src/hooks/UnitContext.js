import React, { useContext } from 'react';
import useLocalStorage from './useLocalStorage';

const UnitContext = React.createContext();

export function useUnitContext() {
    return useContext(UnitContext);
}

export function UnitProvider({ children }) {
    const [unit, setUnit] = useLocalStorage('unit');

    return (
        <UnitContext.Provider value={[unit, setUnit]}>
            { children }
        </UnitContext.Provider>
    );
}