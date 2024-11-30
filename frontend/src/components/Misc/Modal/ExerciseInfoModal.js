import Modal from './Modal';
import ModalFooter from './ModalFooter';
import Tabs from '../Tabs/Tabs';
import ExerciseInfo from '../../Exercises/ExerciseInfo';
import ExerciseHistory from '../../Exercises/ExerciseHistory';
import ExerciseGraph from '../../Exercises/ExerciseGraph';
import { useRef } from 'react';

export default function ExerciseInfoModal({ openModal, closeModal, title, customExercise, exerciseId }) {
    const ref = useRef(null);

    return (
        <Modal
            id="infoModal" 
            openModal={openModal} 
            closeModal={closeModal} 
            title={title}
        >
            <Tabs tabNames={!customExercise ? ["About", "History", "Graph"] : ["History", "Graph"]} tabPanelRef={ref}>
                {!customExercise && <ExerciseInfo id={exerciseId} />}
                <ExerciseHistory id={exerciseId} tabPanelRef={ref} />
                <ExerciseGraph id={exerciseId} />
            </Tabs>
            
            <ModalFooter>
                <button className="button button-tertiary" onClick={closeModal}>Close</button>
            </ModalFooter>
        </Modal>
    );
}