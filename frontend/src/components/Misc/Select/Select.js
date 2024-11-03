import styles from './Select.module.css';

export default function Select({ onChange, children }) {
    return (
        <div className={styles.select}>
            <select onChange={onChange}>
                {children}
            </select>
            <div className={styles.arrow}></div>
        </div>
    );
}