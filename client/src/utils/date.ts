export function formatDate(date: string | number) {
    return new Date(date).toLocaleTimeString();
}
