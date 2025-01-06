import { fireEvent, screen } from "@testing-library/dom";

/**
 * Returns if the element's classes match the classes in the array
 * @param element
 * @param classes
 */
export const matchesClasses = (element: HTMLElement, classes: Array<string>): boolean => {
    const classList = Array.from(element.classList);

    if (classList.length !== classes.length) {
        return false;
    }

    for (const cl of classList) {
        if (!classes.includes(cl)) {
            return false;
        }
    }

    return true;
};

/**
 * Clicks an element based on the test ID
 * @param testID 
 * @returns 
 */
export const clickElement = async (testID: string) =>
    fireEvent.click(screen.getByTestId(testID));
