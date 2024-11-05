import ExerciseList from './ExerciseList';
import ExerciseInfo from './ExerciseInfo';
import AddExercise from './AddExercise';
import Modal from '../Misc/Modal/Modal';
import ModalFooter from '../Misc/Modal/ModalFooter';
import { useEffect, useState } from 'react';
import { getExercises, searchExercises } from '../../api/api';
import { useUserContext } from '../../hooks/UserContext';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import styles from './Exercise.module.css';
import { faCircleXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingSpinner from '../Misc/LoadingSpinner/LoadingSpinner';
import Error from '../Misc/Error/Error';
import Select from '../Misc/Select/Select';
import Tabs from '../Misc/Tabs/Tabs';

export default function Exercises() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [exercises, setExercises] = useState(null);
    const [searchText, setSearchText] = useState('');
    const { data: bodyparts } = useFetch(user && `/users/${user?.id}/exercises/bodyparts`);
    const [bodypart, setBodypart] = useState('');
    const [infoModal, setInfoModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [exerciseId, setExerciseId] = useState(null);
    const [customExercise, setCustomExercise] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = e => {
        setSearchText(e.target.value);
    };

    const clearSearch = e => {
        e.target.parentElement.firstChild.value = "";
        setSearchText("");
    };

    const updateExercises = () => {
        if (searchText || bodypart) {
            setLoading(true);
            const controller = new AbortController();
            searchExercises(user?.id, searchText, bodypart, controller)
                .then(res => {
                    if (res?.message === 'You must be logged in as this user to access this resource') navigate('/logout');
                    else if (res) {
                        if (res?.authorisationFailed) {
                            navigate('/logout');
                        }
                        setExercises(res);
                        setError(false);
                    } else {
                        setError(true);
                    }
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
            getExercises(user?.id, controller)
                .then(res => {
                    if (res?.message === 'You must be logged in as this user to access this resource') navigate('/logout');
                    else if (res) {
                        if (res?.authorisationFailed) {
                            navigate('/logout');
                        }
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
    };

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    useEffect(() => {
        updateExercises();
    }, [searchText, bodypart, navigate, user?.id]);

    const handleSelectChange = e => {
        setBodypart(e.target.value);
    };

    return (
        <>
            <h1>Exercises</h1>

            <div className={styles["input-container"]}>
                <button className="button button-primary" onClick={() => setAddModal(true)}><FontAwesomeIcon icon={faPlus} /></button>

                <Select onChange={handleSelectChange}>
                    <option value="">All body parts</option>
                    {bodyparts && bodyparts?.bodyparts.map(el => (
                        <option key={el} value={el}>{el}</option>
                    ))}
                    <option value="Other">Other</option>
                </Select>

                <div className={styles.search}>
                    <input className={styles.input} type="text" onChange={handleSearchChange} placeholder="Search" />
                    {searchText && 
                        <button onClick={clearSearch}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    }
                </div>
            </div>

            
            {
                loading ? <LoadingSpinner /> : error ? <Error text="Failed to load data" /> : undefined
            }

            <Modal 
                openModal={addModal} 
                closeModal={() => setAddModal(false)} 
                title="Add Exercise" 
            >
                <AddExercise 
                    closeModal={() => setAddModal(false)} 
                    bodyparts={bodyparts} 
                    updateExercises={updateExercises} 
                />
            </Modal>

            <Modal 
                openModal={infoModal} 
                closeModal={() => setInfoModal(false)} 
                title={modalTitle}
            >
                <Tabs tabNames={!customExercise ? ["About", "History", "Graph"] : ["History", "Graph"]}>
                    {!customExercise && <ExerciseInfo id={exerciseId} />}
                    <p>hi</p>
                </Tabs>
                <ModalFooter>
                    <button className="button button-tertiary" onClick={() => setInfoModal(false)}>Close</button>
                </ModalFooter>
            </Modal>

            <Modal openModal={editModal} closeModal={() => setEditModal(false)} title="Edit Exercise">
                
            </Modal>

            {exercises && !error && !loading &&
                <ExerciseList 
                    exercises={exercises.exercises} 
                    openInfoModal={() => setInfoModal(true)} 
                    openEditModal={() => setEditModal(true)} 
                    setModalTitle={setModalTitle} 
                    setExerciseId={setExerciseId}
                    isCustom={setCustomExercise}
                />
            }
        </>
    );
}