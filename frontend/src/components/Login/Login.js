import LoginForm from './LoginForm';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../hooks/UserContext';

function Login() {
    const { user } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user]);

    return (
        <>
            <h1 className="h1">Login</h1>
            <LoginForm />
            <p className="p">Don't have an account? <Link className="link" to="/register">Click here</Link> to register.</p>
        </>
    );
}

export default Login;