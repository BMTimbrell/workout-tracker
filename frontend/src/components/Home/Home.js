import { useUserContext } from '../../hooks/UserContext';
import { Link } from 'react-router-dom';
import Routines from '../Routines/Routines';
import styles from './Home.module.css';

export default function Home() {
    const { user } = useUserContext();


    if (!user) return (
        <>
            <h1>Start Workout</h1>

            <p className={styles.about}>
                This is an app for tracking workouts. You can create a workout template from a list of available, or user-made, exercises. <Link className="link" to="/login">Log in</Link> to use this app.
            </p>
        </>
    );

    return (
        <>
            <h1>Start Workout</h1>
            <Routines />
        </>
    );
}