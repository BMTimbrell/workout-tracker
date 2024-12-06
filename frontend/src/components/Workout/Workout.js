import { useState, useEffect, useRef } from 'react';
import styles from './Workout.module.css';
import WorkoutForm from './WorkoutForm';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../Misc/Modal/Modal';
import modalStyles from '../Misc/Modal/Modal.module.css';
import ModalFooter from '../Misc/Modal/ModalFooter';
import { addWorkout } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import Error from '../Misc/Error/Error';

export default function Workout({ 
    workout, 
    setWorkout, 
    removeWorkout, 
    setUpdateModal,
    setRoutine 
}) {
    const { user } = useUserContext();
    const [elapsedTime, setElapsedTime] = useState(Date.now() - workout.startTime);
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState();
    const [editingName, setEditingName] = useState(false);
    const nameRef = useRef(null);
    const [cancelModal, setCancelModal] = useState(false);
    const [finishModal, setFinishModal] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsedTime(Date.now() - workout.startTime);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };

    }, [workout.startTime]);

    useEffect(() => {
        if (nameRef?.current && editingName) {
            nameRef.current.focus();
        }
    }, [editingName, nameRef]);

    useEffect(() => {
        if (finishModal === false) {
            setError(false);
        }
    }, [finishModal]);

    const formatTime = () => {
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = String(Math.floor(elapsedTime / (1000 * 60) % 60)).padStart(2, "0");
        const seconds = String(Math.floor(elapsedTime / (1000) % 60)).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleChange = e => {
        setWorkout(prev => ({
            ...prev,
            name: e.target.value
        }));
    };

    const handleBlur = e => {
        if (e.target.value) {
            setEditingName(false);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        const unfinishedSets = [].concat(...workout.exercises.map(
            exercise => exercise[1]).map(sets => sets.filter(set => !set.reps)
        )).map(set => set.id);

        setRoutine({
            id: workout.routineId,
            exercises: workout.exercises,
            removedSets: [...(workout?.setsToDelete || []), ...unfinishedSets]
        });

        if (unfinishedSets.length > 0) {
            setSubmitMessage(
                'Any empty sets will be deleted. Sets with data will be marked as completed.'
            );
        } else {
            setSubmitMessage('');
        }

        setFinishModal(true);
    };

    const confirmSubmit = async () => {
        setSubmitting(true);

        let exerciseData = JSON.parse(JSON.stringify(workout));

        exerciseData = exerciseData.exercises.map(exercise => {
            exercise[1] = exercise[1].filter(set => set.reps);
            return exercise;
        }).filter(exercise => exercise[1].length);
        
        const response = await addWorkout(
            user?.id, 
            workout.name, 
            exerciseData, 
            { 
                start: new Date(workout.startTime).toISOString(), 
                duration: formatTime() 
            },
            user?.units === "lbs" ? "lbs" : "kg"
        );

        if (response?.authorizationFailed) {
            navigate('/logout');
        } else if (response) {
            setError(false);
            setFinishModal(false);

            if (!workout?.quickstart) {
                setUpdateModal(true);
            }
            removeWorkout();
        } else {
            setError(true);
        }

        setSubmitting(false);
    };

    return (
        <section id="workout" className={styles.container}>
            {!editingName ? (
                <div className={styles["heading-container"]}>
                    <h2>{workout.name}</h2>
                    <button 
                        className="button button-secondary" 
                        onClick={() => setEditingName(true)}
                    >
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                </div>
            ) :
                <div className="floating-input">
                    <input 
                        id="name"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={nameRef} 
                        placeholder=" "
                        value={workout.name} 
                        form="addWorkoutFrom"
                        required 
                    />
                    <label htmlFor="name">Workout Name</label>
                </div>
            }

            <p>{formatTime()}</p>
            
            <WorkoutForm 
                handleSubmit={handleSubmit} 
                formData={workout} 
                error={error} 
                setFormData={setWorkout}
            />

            <div className={styles["button-container"]}>
                <button form="addWorkoutForm" className="button button-primary" type="submit" onClick={handleSubmit}>
                    Finish
                </button>
                <button className="button button-danger" type="button" onClick={() => setCancelModal(true)}>
                    Cancel
                </button>
            </div>

            <Modal 
                openModal={cancelModal} 
                closeModal={() => setCancelModal(false)} 
                title="Cancel Workout?"
            >
                <p>Are you sure you want to cancel this workout? This process can't be undone.</p>
                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button onClick={() => setCancelModal(false)} className="button button-tertiary">
                            Continue
                        </button>
                        <button 
                            className="button button-danger" 
                            onClick={removeWorkout}
                        >
                            Cancel Workout
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal 
                openModal={finishModal} 
                closeModal={() => setFinishModal(false)} 
                title="Finish Workout?"
            >
                <p>{submitMessage}</p>
                {error && <p><Error text="Submission failed" /></p>}
                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button onClick={() => setFinishModal(false)} className="button button-tertiary">
                            Cancel
                        </button>
                        <button 
                            className="button button-primary" 
                            onClick={confirmSubmit}
                            disabled={submitting}
                        >
                            {!submitting ? 'Finish' : 'Saving...'}
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

        </section>
    );
}