import styles from './Select.module.css';

export default function Select({ onChange, children, id, value, className }) {
    const properties = {
        onChange,
        id,
        value
    };

    return (
        <div className={className ? `${styles.select} ${className}` : styles.select}>
            <select { ...properties }>
                {children}
            </select>
            <div className={styles.arrow}></div>
        </div>
    );
}