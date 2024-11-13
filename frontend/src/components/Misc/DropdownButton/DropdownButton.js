import styles from './DropdownButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import useEventListener from '../../../hooks/useEventListener';

export default function DropdownButton({ children }) {
    const listRef = useRef();
    const buttonRef = useRef();
    const [selected, toggleSelected] = useState(false);

    useEventListener('click', e => {
        if (e.target !== listRef?.current && e.target !== buttonRef?.current) {
            toggleSelected(false);
        }
    });

    return (
        <div className={styles.container}>
            <button ref={buttonRef} type="button" className="button button-secondary" onClick={() => toggleSelected(!selected)}>
                <FontAwesomeIcon icon={faEllipsis} />
            </button>

            {selected &&
                <ul ref={listRef} className={styles.dropdown}>
                    {children.map((child, index) => (
                        <li key={index}>{child}</li>
                    ))}
                </ul>
            }
        </div>
    );
}