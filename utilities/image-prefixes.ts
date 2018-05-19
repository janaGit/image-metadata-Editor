
export const IMAGE_EDITED = "edited_";
export const METADATA_DELETED = "editedx_";
export const imagePrefixes = [IMAGE_EDITED, METADATA_DELETED]
/**
 * This method tests if an image name exists in the list without
 * taking the prefixes into account. Then it returns the Name with its prefix.
 */
export function getImageNameInList_prefixNotConsidered(imageName, imageList: string[]): string {
    return imageList.find(imgName => {
        let name = imagePrefixes.find(prefix => {
            return imgName == prefix + imageName;
        })
        if (name) {
            return true;
        }
        return false;
    })
}

/**
 * This method checks, if the image file has been
 * processed with the "delete Metadata" button.
 */
export function isMetadataDeleted(imgName: string): boolean {
    let deleted = imgName.startsWith(METADATA_DELETED);
    if (deleted) {
        return true;
    }
    return false;
}

/**
 * This method returns the name without prefixes that are defined in: "imagesPrefixes". 
 * @param name 
 */
export function getImageNameWithoutPrefix(name: string): string {
    let prefix = imagePrefixes.find(prefix => name.startsWith(prefix));
    if (prefix) {
        return name.substring(prefix.length);
    }
    return name;
}