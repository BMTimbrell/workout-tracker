import React from 'react';
import styles from './Modal.module.css';

export default function ModalFooter({ children }) {
    return (
        <div className={children?.length > 1 ? `${styles["modal-footer-multiple-items"]} ${styles["modal-footer"]}` : styles["modal-footer"]}>
            {children?.length ? children?.map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            )) : children}
        </div>
    );
}