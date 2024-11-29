import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Routines.module.css';
import modalStyles from '../Misc/Modal/Modal.module.css';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import EditModal from '../Misc/Modal/EditModal';
import { useState, useEffect, useCallback } from 'react';
import { getRoutines } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import AddRoutine from './AddRoutine';
import Routine from './Routine';
import UseRoutine from './UseRoutine';
import { editRoutine, deleteRoutine } from '../../api/api';

export default function Routines({ workout, setWorkout }) {
    const { user } = useUserContext();

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [workoutModal, setWorkoutModal] = useState(false);
    const [newWorkoutModal, setNewWorkoutModal] = useState(false);

    const [routines, setRoutines] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [addRoutineFooter, setAddRoutineFooter] = useState(null);

    const [selectedRoutine, setSelectedRoutine] = useState({
        id: 0,
        name: "",
        exercises: [],
        setsToDelete: []
    });

    const updateRoutines = useCallback(async () => {
        setLoading(true);
        const controller = new AbortController();

        const response = await getRoutines(user?.id, controller);

        if (response?.authorisationFailed) {
            navigate('/logout');
        } else if (response?.abortError) {
            setError(false);
        } else if (response) {
            setError(false);
            setRoutines(response.routines);
        } else {
            setError(true);
        }

        setLoading(false);
    }, [navigate, user?.id]);

    useEffect(() => {
        updateRoutines();
    }, [updateRoutines]);

    const formatWorkout = () => {
        // make sets empty and use routine sets as placeholders for workout form
        const exercises = selectedRoutine.exercises.map(exercise => {
            const placeholders = exercise[1];
            const sets = exercise[1].map((set, index) => ({
                 id: set.id, 
                 weight: 0, 
                 reps: 0, 
                 placeholder: { 
                    weight: placeholders[index].weight,
                    reps: placeholders[index].reps
                },
                completed: false 
            }));
            exercise = [
                exercise[0],
                sets
            ];
            return exercise;
        });

        setWorkout({
            name: selectedRoutine.name,
            exercises,
            startTime: Date.now()
        });
    };

    return (
        <section>
            <div className={styles["heading-container"]}>
                <h2>Routines</h2>
                <button className="button button-primary" onClick={() => setAddModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> 
                </button>
            </div>

            {loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined}

            {routines?.length === 0 && !loading && !error ? <p className={styles["new-routine"]}>You currently have no routines -&nbsp;
                <button className="link-button" onClick={() => setAddModal(true)}>
                    Click here
                </button> to add a new routine.</p> : (
                <div className={styles.container}>
                    {routines && !loading && routines.map((routine, index) => (
                        <Routine 
                            key={index} 
                            routine={routine} 
                            openModal={() => setEditModal(true)} 
                            setSelectedRoutine={setSelectedRoutine}
                            openWorkoutModal={() => setWorkoutModal(true)} 
                        />
                    ))}
                </div>
            )}

            <Modal 
                openModal={addModal} 
                closeModal={() => setAddModal(false)} 
                title="Add Routine"
                footer={addRoutineFooter}
            >
                <AddRoutine 
                    closeModal={() => setAddModal(false)} 
                    setFooter={setAddRoutineFooter} 
                    updateRoutines={updateRoutines} 
                    onClose={!addModal} 
                />
            </Modal>

            <EditModal
                openModal={editModal}
                closeModal={() => setEditModal(false)}
                title="Edit Routine"
                updateFunction={updateRoutines}
                editFunction={editRoutine}
                deleteFunction={deleteRoutine}
                formData={selectedRoutine}
                setFormData={setSelectedRoutine}
                onClose={!editModal}
                formId="editRoutineForm"
                formComponent={"routine"}
             />

            <Modal 
                openModal={workoutModal} 
                closeModal={() => setWorkoutModal(false)} 
                title={selectedRoutine.name}
            >
                <UseRoutine routine={selectedRoutine} />
                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button className="button button-tertiary" onClick={() => setWorkoutModal(false)}>
                            Cancel
                        </button>
                        <button className="button button-primary" 
                            onClick={() => {
                                if (!workout) {
                                    setWorkoutModal(false);
                                    formatWorkout();
                                    window.scrollTo({ top: 0, behavior: 'smooth'});
                                } else {
                                    setNewWorkoutModal(true);
                                }
                            }}
                        >
                            Start Workout
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal 
                openModal={newWorkoutModal} 
                closeModal={() => setNewWorkoutModal(false)} 
                title="Workout in Progress"
            >
                <p>A workout is already in progress. If you start a new one, the old one will be cancelled.</p>
                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button className="button button-tertiary" 
                            onClick={() => {
                                setNewWorkoutModal(false);
                                setWorkoutModal(false);
                            }}
                        >
                            Continue Current Workout
                        </button>
                        <button className="button button-danger" 
                            onClick={() => {
                                setNewWorkoutModal(false);
                                setWorkoutModal(false);
                                formatWorkout();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Start New Workout
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </section>
    );
}