import RegistrationForm from './RegistrationForm';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';

export default function Register() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) navigate('/');
    }, [user]);

    return (
        <>
            {!success ? (
                <>
                    <h1 className="h1">Register</h1>
                    <RegistrationForm setSuccess={setSuccess} />
                    <p className="p">Already have an account? <Link className="link" to="/login">Click here</Link> to log in.</p>
                </>
            ) : (
                <>
                    <h1>Registration successful!</h1>
                    <p>
                        <Link to="/login">Sign in</Link>
                    </p>
                </>
            )}
        </>
    );
}