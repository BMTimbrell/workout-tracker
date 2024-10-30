import ExerciseList from './ExerciseList';
import { useEffect, useState } from 'react';
import { getExercises, searchExercises } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from './Exercise.module.css';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Error from '../Error/Error';

export default function Exercises() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [exercises, setExercises] = useState(null);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setSearchText(e.target.value);
    };

    const clearSearch = e => {
        e.target.parentElement.firstChild.value = "";
        setSearchText("");
    };

    useEffect(() => {
        if (!user) navigate('/login');
        if (exercises?.authorisationFailed) {
            navigate('/logout');
        }
    }, [exercises, user]);

    useEffect(() => {
        if (searchText) {
            setLoading(true);
            const controller = new AbortController();
            searchExercises(user.id, searchText, controller)
                .then(res => {
                    if (res?.message === 'You must be logged in as this user to access this resource') navigate('/logout');
                    else if (res) {
                        setExercises(res);
                        setError(false);
                    } else setError(true);
                })
                .catch(e => {
                    setError(true);
                })
                .finally(() => setLoading(false));
            return () => {
                controller.abort();
            }
        } else {
            setLoading(true);
            const controller = new AbortController();
            getExercises(user.id, controller)
                .then(res => {
                    if (res?.message === 'You must be logged in as this user to access this resource') navigate('/logout');
                    else if (res) {
                        setExercises(res);
                        setError(false);
                    } else setError(true);
                })
                .catch(e => {
                    setError(true);
                })
                .finally(() => setLoading(false));
            return () => {
                controller.abort();
            }
        }
    }, [searchText]);

    return (
        <>
            <h1>Exercises</h1>


            <div className={styles.search}>
                <input className={styles.input} type="text" onChange={handleChange} placeholder="Search" />
                <button className={!searchText ? "hidden" : undefined} onClick={clearSearch}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                </button>
            </div>
            
            {
                loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined
            }

            {exercises &&
                <ExerciseList exercises={exercises.exercises} />
            }
        </>
    );
}