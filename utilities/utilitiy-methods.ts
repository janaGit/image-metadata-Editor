import { FILE_NAMES_TO_IGNORE } from "./constants";

export function filterFilesToIgnore(fileName: string) {
        return FILE_NAMES_TO_IGNORE.indexOf(fileName) === -1;
}

export function deepCopyFunction(inObject) {
        let outObject, value, key

        if (typeof inObject !== "object" || inObject === null) {
                return inObject // Return the value if inObject is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {}

        for (key in inObject) {
                value = inObject[key]

                // Recursively (deep) copy for nested objects, including arrays
                outObject[key] = deepCopyFunction(value)
        }

        return outObject
}

export function extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
                throw new Error('Bad response status: ' + res.status);
        }
        return res.data || {};
}
export function handleError(error: any) {
        let err = error.message || 'Server error';
        console.error(err);
}