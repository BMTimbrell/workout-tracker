import styles from './Error.module.css';

export default function Error({ text, style }) {
    return (
        <div className={style ? `${style} ${styles.error}` : styles.error}>
            <span>{text}</span>
        </div>
    );
}