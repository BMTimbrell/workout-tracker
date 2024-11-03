import LoginForm from './LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        </>
    );
}

export default Login;