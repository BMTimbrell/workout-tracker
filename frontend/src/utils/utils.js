export function calc1RM(weight, reps) {
    return weight / (1.0278 - 0.0278 * reps);
}

export function formatDate(date) {
    return date ? `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}` : '';
}

export function convertToLbs(weight) {
    return Math.round(weight * 2.20462);
}

export function convertToKg(weight) {
   return Math.round(weight / 2.205 * 10) / 10;
}