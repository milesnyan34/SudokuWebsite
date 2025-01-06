import { useEffect } from "react"

/**
 * Hook that detects clicks outside of a component. You need to provide a ref and put it in the component
 * @param ref 
 * @param onClick 
 */
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