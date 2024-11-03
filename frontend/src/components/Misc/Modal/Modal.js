import { useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ openModal, closeModal, children, title }) {
    const ref = useRef();

    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog className={styles.modal} ref={ref} onCancel={closeModal}>
            <div className={styles["modal-content"]}>

                <div className={styles["modal-header"]}>
                    <h3>{title}</h3>
                    <button onClick={closeModal} className={styles["modal-close"]}>&times;</button>
                </div>

                { children }
            </div>
        </dialog>
    );
}