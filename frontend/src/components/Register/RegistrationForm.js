import { useState, useRef } from 'react';
import { registerUser } from '../../api/api';
import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import styles from '../Register/Register.module.css';
import { Link } from 'react-router-dom';

export default function RegistrationForm({ setSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        reEnteredPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const rePasswordRef = useRef();

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

                if (!rePasswordRef.current.value) {
                    break;
                } else if (e.target.value !== formData.reEnteredPassword) {
                    rePasswordRef.current.classList.remove(styles.success);
                    rePasswordRef.current.classList.add(styles.danger);
                } else {
                    rePasswordRef.current.classList.remove(styles.danger);
                    rePasswordRef.current.classList.add(styles.success);
                }

                break;
            case 'reEnteredPassword':
                setFormData(prev => ({...prev, reEnteredPassword: e.target.value}));

                if (!e.target.value) {
                    e.target.classList.remove(styles.success);
                    e.target.classList.remove(styles.warning);
                    e.target.classList.remove(styles.danger);
                } else if (e.target.value !== formData.password) {
                    e.target.classList.remove(styles.success);
                    e.target.classList.remove(styles.danger);
                    e.target.classList.add(styles.warning);
                } else {
                    e.target.classList.remove(styles.warning);
                    e.target.classList.remove(styles.danger);
                    e.target.classList.add(styles.success);
                }

                break;
            default:
                break;
        }
    };

    const handleBlur = e => {
        if (e.target.value && e.target.value !== formData.password) {
            e.target.classList.remove(styles.warning);
            e.target.classList.add(styles.danger);
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

            <div className="input-container">

                <div className="floating-input">
                    <input
                        className={styles.input}
                        id="email"
                        type="email" 
                        name="email" 
                        pattern="^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$"
                        onChange={handleChange} 
                        placeholder=" " 
                        autoComplete="off"
                        required 
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="floating-input">
                    <input
                        className={styles.input}
                        id="name"
                        type="text" 
                        name="name" 
                        onChange={handleChange} 
                        placeholder=" "
                        autoComplete="off" 
                        required 
                    />
                    <label htmlFor="name">Name</label>
                </div>

                <div className="floating-input">
                    <input
                        className={styles.input}
                        id="password"
                        type="password" 
                        name="password" 
                        onChange={handleChange} 
                        placeholder=" "
                        autoComplete="off" 
                        required 
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <div className="floating-input">
                    <input 
                        className={styles.input}
                        id="rePassword"
                        type="password" 
                        name="reEnteredPassword" 
                        onChange={handleChange} 
                        placeholder=" " 
                        autoComplete="off"
                        ref={rePasswordRef}
                        required 
                        onBlur={handleBlur}
                    />
                    <label htmlFor="rePassword">Re-enter password</label>
                </div>

                <button className="button button-big button-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>   
                {error && <Error style={errorStyles['form-error']} text={error}  />}

                <p>
                    Already have an account? <Link className="link" to="/login">Click here</Link> to log in.
                </p>

            </div>

        </form>
    );
}