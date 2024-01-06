export default function debounce<A extends Array<unknown>>(fn: (...args: A) => void, timeOut = 500) {
    let previousTimeout: NodeJS.Timeout | null = null;
    return (...args: A) => {
        if (previousTimeout) {
            clearTimeout(previousTimeout);
            previousTimeout = null;
        }
        previousTimeout = setTimeout(() => {
            fn(...args);
            previousTimeout = null;
        }, timeOut)
    }
}