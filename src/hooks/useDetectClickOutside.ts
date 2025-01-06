import { useEffect } from "react"

// Ref that detects clicks outside of a component
export const useDetectClickOutside = (ref, onClick) => {
    useEffect(() => {
        const handleClickOutside = event => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClick();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [ref, onClick]);
}