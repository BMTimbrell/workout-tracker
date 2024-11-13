import Error from '../Misc/Error/Error';
import errorStyles from '../Misc/Error/Error.module.css';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import { useState } from 'react';
import Exercises from '../Exercises/Exercises';
import modalStyles from '../Misc/Modal/Modal.module.css';
import styles from './RoutineForm.module.css';
import RoutineExercise from './RoutineExercise';

export default function RoutineForm({ handleSubmit, formData, setFormData, error }) {

    const [exerciseModal, setExerciseModal] = useState(false);
    const [exercises, setExercises] = useState([]);

    const [replaceModal, setReplaceModal] = useState(false);
    const [indexToReplace, setIndexToReplace] = useState(null);

    const [selectedExercise, setSelectedExercise] = useState(null);

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            name: e.target.value
        }));
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

    return (
        <>
            <form id="addRoutineForm" className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <div className="floating-input">
                        <input 
                            id="name"
                            type="text"
                            onChange={handleChange} 
                            placeholder=" "
                            value={formData.name} 
                            required 
                        />
                        <label htmlFor="name">Routine Name</label>
                    </div>

                    <button type="button" onClick={() => setExerciseModal(true)} className="button button-secondary">Add Exercises</button>

                    {formData.exercises.map((exercise, index) => (
                        <RoutineExercise 
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
                        >
                        </RoutineExercise>
                    ))}

                    {error && <Error style={errorStyles['form-error']} text="Submission failed" />}
                </div>
            </form>

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
                            Close
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

            <Modal
                openModal={replaceModal} 
                closeModal={() => setExerciseModal(false)} 
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
                                setExerciseModal(false);
                                setExercises([]);
                            }}
                        >
                            Close
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
        </>
    );
}