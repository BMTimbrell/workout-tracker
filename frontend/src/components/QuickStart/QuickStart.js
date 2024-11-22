import styles from './QuickStart.module.css';
import { useState } from 'react';
import Modal from '../Misc/Modal/Modal';
import modalStyles from '../Misc/Modal/Modal.module.css';
import ModalFooter from '../Misc/Modal/ModalFooter';

export default function QuickStart({ workout, setWorkout }) {
    const [newWorkoutModal, setNewWorkoutModal] = useState(false);

    return (
        <section className={styles.container}>
            <h2>Quick Start</h2>
            <button className="button button-primary" onClick={() => {
                if (!workout) {
                    setWorkout({
                        name: "My Workout",
                        exercises: [],
                        startTime: Date.now()
                    });
                } else {
                    setNewWorkoutModal(true);
                }

            }}>Start Empty Workout</button>

            <Modal 
                openModal={newWorkoutModal} 
                closeModal={() => setNewWorkoutModal(false)} 
                title="Workout in Progress"
            >
                <p>A workout is already in progress. If you start a new one, the old one will be cancelled.</p>
                <ModalFooter>
                    <div className={modalStyles["button-container"]} style={{width: "100%"}}>
                        <button className="button button-tertiary" 
                            onClick={() => {
                                setNewWorkoutModal(false);
                            }}
                        >
                            Continue Current Workout
                        </button>
                        <button className="button button-danger" 
                            onClick={() => {
                                setNewWorkoutModal(false);
                                setWorkout({
                                    name: "My Workout",
                                    exercises: [],
                                    startTime: Date.now()
                                });
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