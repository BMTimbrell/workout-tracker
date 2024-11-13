import React, { useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ openModal, closeModal, children, title, footer }) {
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
            <div className={styles["modal-header"]}>
                <h3>{title}</h3>
                <button onClick={closeModal} className={styles["modal-close"]}>&times;</button>
            </div>

            <div className={styles["modal-content"]}>
                {Array.isArray(children) ? children.filter((el, index) => index < children.length - 1) : children}
            </div>

            {footer ? footer : children[children.length - 1]}
        </dialog>
    );
}