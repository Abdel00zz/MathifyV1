
/**
 * A utility function to debounce a function call.
 * It delays the execution of a function until after a certain amount of time has passed
 * since the last time it was invoked.
 * @param func The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A new debounced function.
 */
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
