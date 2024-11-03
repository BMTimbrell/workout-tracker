import { useState } from 'react';
import { loginUser, fetchUser } from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';
import Error from '../Error/Error';
import errorStyles from '../Error/Error.module.css';

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

            <div className="input-container">

                <div className="floating-input">
                    <input 
                        id="email"
                        type="email" 
                        name="email"
                        onChange={handleChange}
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" 
                        placeholder=" " 
                        required 
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="floating-input">
                    <input 
                        id="password"
                        type="password" 
                        name="password" 
                        onChange={handleChange} 
                        placeholder=" " 
                        required 
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="button button-primary button-big" type="submit" disabled={loading}>{!loading ? 'Log in' : 'Logging in...'}</button>

                {error && <Error style={errorStyles['form-error']} text={error}  />}

                <p>Don't have an account? <Link className="link" to="/register">Click here</Link> to register.</p>

            </div>


        </form>
    );
}