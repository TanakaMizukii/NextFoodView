import { createContext } from 'react';

export const ToggleChangeContext = createContext<{ toggleChange: () => void }>({
    toggleChange: () => {
        console.warn("toggleChange function was called without a Provider.");
    },
});
