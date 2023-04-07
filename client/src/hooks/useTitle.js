import { useEffect } from 'react';

// This hook is used to change the title of the page
export default function useTitle(title) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    });
}
