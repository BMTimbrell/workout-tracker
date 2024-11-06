import styles from './Select.module.css';

export default function Select({ onChange, children, id, value }) {
    const properties = {
        onChange,
        id,
        value
    };

    return (
        <div className={styles.select}>
            <select { ...properties }>
                {children}
            </select>
            <div className={styles.arrow}></div>
        </div>
    );
}