import useFetch from '../../hooks/useFetch';
import { useUserContext } from '../../hooks/UserContext';
import Error from '../Misc/Error/Error';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import styles from './UseRoutineExercise.module.css';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ExerciseInfoModal from '../Misc/Modal/ExerciseInfoModal';

export default function UseRoutineExercise({ data }) {
    const { user } = useUserContext();
    const [exercise, loading, error]  = useFetch(user && data[0] && `/users/${user?.id}/exercises/${data[0]}/name/bodypart`);
    const [infoModal, setInfoModal] = useState(false);

    return (
        <div className={styles.container}>
            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {
                exercise && !loading && (
                    <>
                        <ul className={styles.list}>
                            <li>{`${data[1].length} x ${exercise.name}`}</li>
                            <li>{exercise.bodypart}</li>
                        </ul>
                        <button type="button" className="button button-secondary" onClick={() => setInfoModal(true)}>
                            <FontAwesomeIcon icon={faInfo} />
                        </button>
                    </>
                )
            }

            <ExerciseInfoModal
                openModal={infoModal}
                closeModal={() => setInfoModal(false)}
                title={exercise?.name}
                customExercise={exercise?.user_id}
                exerciseId={exercise?.id}
            />
        </div>
    );
}