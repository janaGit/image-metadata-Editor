import { FILE_NAMES_TO_IGNORE } from "./constants";

export function filterFilesToIgnore(fileName: string) {
        return FILE_NAMES_TO_IGNORE.indexOf(fileName) === -1;
}
// from: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
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

//from: https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
export function areArraysEqual(_arr1, _arr2) {

        if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
          return false;
    
        var arr1 = _arr1.concat().sort();
        var arr2 = _arr2.concat().sort();
    
        for (var i = 0; i < arr1.length; i++) {
    
            if (arr1[i] !== arr2[i])
                return false;
    
        }
    
        return true;
    
    }