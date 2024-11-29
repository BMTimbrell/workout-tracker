import React, { useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ openModal, closeModal, children, title, footer }) {
    const ref = useRef(null);

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

            {/* make overflow hidden if has tabs so can keep tab links fixed */}
            <div className={
                Array.isArray(children) && children.some(child => child?.type?.name === "Tabs") ? 
                    `${styles["modal-content"]} ${styles["overflow-hidden"]}` : 
                    styles["modal-content"]
            }>
                {Array.isArray(children) ? children.filter((el, index) => index < children.length - 1) : children}
            </div>

            {footer ? footer : children[children.length - 1]}
        </dialog>
    );
}