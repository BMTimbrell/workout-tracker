import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState } from 'react';
import Exercises from '../Exercises/Exercises';
import modalStyles from '../Misc/Modal/Modal.module.css';
import styles from '../Routines/RoutineForm.module.css';
import WorkoutExercise from './WorkoutExercise';
import Tabs from '../Misc/Tabs/Tabs';
import ExerciseInfo from '../Exercises/ExerciseInfo';
import ExerciseInfoModal from '../Misc/Modal/ExerciseInfoModal';

export default function WorkoutForm({ handleSubmit, formData, setFormData, isEdit = false }) {

    const [exerciseModal, setExerciseModal] = useState(false);
    const [exercises, setExercises] = useState([]);

    const [infoModal, setInfoModal] = useState(false);
    const [infoExercise, setInfoExercise] = useState({
        name: "",
        id: 0,
        userId: 0
    });

    const [replaceModal, setReplaceModal] = useState(false);
    const [indexToReplace, setIndexToReplace] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [exerciseToRemove, setExerciseToRemove] = useState(null);

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value
        }))
    };

    const addExercises = exercises => {
        setExercises(prev => [...prev, exercises]);
    };

    const removeExercise = id => {
        setExercises(prev => prev.filter(e => e[0] !== id));
    };

    const swapExercises = exerciseIndex => {
        const newExercises = formData.exercises;
        const selectedIndex = newExercises.findIndex(el => el === selectedExercise);
        const temp = newExercises[selectedIndex];
        newExercises[selectedIndex] = newExercises[exerciseIndex];
        newExercises[exerciseIndex] = temp;
        setFormData(prev => ({
            ...prev,
            exercises: newExercises
        }));
        setSelectedExercise(null);
    };

    const replaceExercise = exercises => {
        setFormData(prev => ({
            ...prev,
            exercises: [
                ...(indexToReplace === 0 ? exercises : [...prev.exercises.slice(0, indexToReplace), ...exercises]), 
                ...prev.exercises.slice(indexToReplace + 1)
            ]
        }));
    };

    const openDeleteModal = exercise => {
        setExerciseToRemove(exercise);
        setDeleteModal(true);
    };

    const deleteFormExercise = () => {
        setFormData(prev => ({
            ...prev,
            exercises: prev.exercises.filter((exercise, index) => {
                return index !== exerciseToRemove.index;
            })
        }));
        setDeleteModal(false);
    };

    return (
        <>
            <form id={isEdit ? "editWorkoutForm" : "addWorkoutForm"} className="form" onSubmit={handleSubmit}>
                <div className="input-container">


                    {isEdit && (
                        <div className="floating-input">
                            <input 
                                id="name"
                                type="text"
                                onChange={handleChange} 
                                placeholder=" "
                                value={formData.name} 
                                required 
                            />
                            <label htmlFor="name">Workout Name</label>
                        </div>
                    )}

                    {formData.exercises.map((exercise, index) => (
                        <WorkoutExercise 
                            key={index} 
                            id={exercise[0]} 
                            index={index} 
                            exercises={formData.exercises} 
                            setExercises={(exercises) => setFormData(prev => ({
                                ...prev,
                                exercises
                            }))}
                            selectedExercise={selectedExercise}
                            toggleSelected={ex => {
                                if (ex === selectedExercise) {
                                    setSelectedExercise(null);
                                } else if (selectedExercise === null) {
                                    setSelectedExercise(ex);
                                } else {
                                    swapExercises(index)
                                }
                            }}
                            replace={() => {
                                setIndexToReplace(index);
                                setReplaceModal(true);
                            }}
                            openDeleteModal={ex => openDeleteModal(ex)}
                            setInfo={info => {
                                setInfoExercise(prev => ({
                                    ...prev,
                                    name: info.name,
                                    id: info.id,
                                    userId: info.userId
                                }));
                                setInfoModal(true);
                            }}
                        />
                    ))}

                    <button type="button" onClick={() => setExerciseModal(true)} className="button button-secondary">Add Exercises</button>

                </div>
            </form>
            
            {/* add exercise modal */}
            <Modal
                openModal={exerciseModal} 
                closeModal={() => setExerciseModal(false)} 
                title="Add Exercises"
            >
                <div className={styles["exercise-container"]}>
                    <Exercises 
                        isModal={true} 
                        addToForm={addExercises} 
                        exercisesAdded={exercises.map(el => el[0])} 
                        removeFromForm={removeExercise}
                    />
                </div>

                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button 
                            className="button button-tertiary" 
                            onClick={() => {
                                setExerciseModal(false);
                                setExercises([]);
                            }}
                        >
                            Cancel
                        </button>

                        <button 
                            type="button" 
                            className="button button-primary" 
                            disabled={exercises.length < 1}
                            onClick={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    exercises: [...prev.exercises, ...exercises]
                                }));
                                setExercises([]);
                                setExerciseModal(false);
                            }}
                        >
                            Add{exercises.length > 1 && ` (${exercises.length})`}
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            {/* replace exercise modal */}
            <Modal
                openModal={replaceModal} 
                closeModal={() => setReplaceModal(false)} 
                title="Replace Exercise"
            >
                <div className={styles["exercise-container"]}>
                    <Exercises 
                        isModal={true} 
                        addToForm={addExercises} 
                        exercisesAdded={exercises.map(el => el[0])} 
                        removeFromForm={removeExercise}
                    />
                </div>

                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button 
                            className="button button-tertiary" 
                            onClick={() => {
                                setReplaceModal(false);
                                setExercises([]);
                            }}
                        >
                            Cancel
                        </button>

                        <button 
                            type="button" 
                            className="button button-primary" 
                            disabled={exercises.length < 1}
                            onClick={() => {
                                replaceExercise(exercises);
                                setExercises([]);
                                setIndexToReplace(null);
                                setReplaceModal(false);
                            }}
                        >
                            Replace{exercises.length > 1 && ` (${exercises.length})`}
                        </button>
                    </div>
                </ModalFooter>
            </Modal>


            {/* delete exercise modal */}
            <Modal 
                openModal={deleteModal} 
                closeModal={() => setDeleteModal(false)} 
                title="Delete Routine?"
            >
                <p>Are you sure you want to delete "{exerciseToRemove?.name}" and all of its sets from this workout? This process can't be undone.</p>

                <ModalFooter>
                    <div className={modalStyles["button-container"]}>
                        <button onClick={() => setDeleteModal(false)} className="button button-tertiary">Cancel</button>
                        <button 
                            className="button button-danger" 
                            onClick={deleteFormExercise}
                        >
                            Delete
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            {/* exercise info */}
            <ExerciseInfoModal
                openModal={infoModal}
                closeModal={() => setInfoModal(false)} 
                title={infoExercise.name}
                exerciseId={infoExercise.id}
                customExercise={infoExercise.userId}
            />
        </>
    );
}