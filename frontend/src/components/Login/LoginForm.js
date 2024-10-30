import { useState } from 'react';
import { loginUser, fetchUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import errorStyle from '../Error/Error.module.css';
import Error from '../Error/Error';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const handleChange = e => {
        if (e.target.name === 'email')
            setFormData(prev => ({...prev, email: e.target.value}));
        else if (e.target.name === 'password')
            setFormData(prev => ({...prev, password: e.target.value}));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const userIdResponse = await loginUser(formData.email, formData.password);

        if (userIdResponse?.message === 'wrong password') {
            setError('Email or password is incorrect.');
        } else if (userIdResponse) {
            const userResponse = await fetchUser(userIdResponse.id);
            
            if (userResponse) {
                setUser({ id: userResponse.id });
                navigate('/');
            } else {
                setError('Login failed.');
            }

        } else {
            setError('Login failed.');
        }

        setLoading(false);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input 
                type="email" 
                name="email"
                onChange={handleChange} 
                placeholder="Enter Email" 
                required 
            />
            <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                placeholder="Enter Password" 
                required 
            />
            <button type="submit" disabled={loading}>{!loading ? 'Login' : 'Logging in...'}</button>
            <Error style={error ? errorStyle.error : 'hidden'} text={error}  />
        </form>
    );
}