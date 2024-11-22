import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue = undefined) {
    const [value, setValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    useEffect(() => {
        if (value !== undefined) 
            localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    const removeValue = () => {
        setValue(undefined);
        localStorage.removeItem(key);
    };

    return [value, setValue, removeValue];
}