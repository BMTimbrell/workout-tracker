import { useState } from 'react';
import { useUserContext } from '../../hooks/UserContext';
import { registerUser } from '../../api/api';

export default function RegistrationForm({ setSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        reEnteredPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        switch (e.target.name) {
            case 'email':
                setFormData(prev => ({...prev, email: e.target.value}));
                break;
            case 'name':
                setFormData(prev => ({...prev, name: e.target.value}));
                break;
            case 'password':
                setFormData(prev => ({...prev, password: e.target.value}));
                break;
            case 'reEnteredPassword':
                setFormData(prev => ({...prev, reEnteredPassword: e.target.value}));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.password !== formData.reEnteredPassword) {
            setError('Passwords must match');
            return;
        }
        setLoading(true);
        const user = await registerUser(formData.name, formData.email, formData.password);
        setLoading(false);

        // errors with submitted data
        if (user?.message === 'user already registered with this email') {
            setError('User already registered with this email');
            return;
        }
        if (user?.error === 'invalid email') {
            setError('You must enter a valid email');
            return;
        }

        if (user?.error === 'invalid name') {
            setError('You must enter a valid name');
            return;
        }

        if (user?.error === 'invalid password') {
            setError('You must enter a valid password');
            return;
        }

        if (user) {
            setSuccess(true);
        } else {
            setError('Registration failed');
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                type="email" 
                name="email" 
                onChange={handleChange} 
                placeholder="Email address" 
                aria-label="Email address"
                autoComplete="off"
                required 
            />
            <input
                type="name" 
                name="name" 
                onChange={handleChange} 
                placeholder="Name"
                aria-label="Name"
                autoComplete="off" 
                required 
            />
            <input
                type="password" 
                name="password" 
                onChange={handleChange} 
                placeholder="Password"
                aria-label="Password"
                autoComplete="off" 
                required 
                />
            <input 
                type="password" 
                name="reEnteredPassword" 
                onChange={handleChange} 
                placeholder="Re-enter password" 
                aria-label="Re-enter password"
                autoComplete="off"
                required 
                />
            <button type="submit" disabled={loading}>Register</button>   
            <p className={error ? 'error' : 'hidden'}>{error}</p>
        </form>
    );
}