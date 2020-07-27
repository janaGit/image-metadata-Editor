import { imageSuffixes, METADATA_DELETED } from "./constants";

/**
 * This method tests if an image name exists in the list without
 * taking the suffixes into account. Then it returns the Name with its suffix.
 */
export function getImageNameInList_suffixNotConsidered(imageName, imageList: string[]): string {
    const imageNameWithoutSuffix=getImageNameWithoutSuffix(imageName);

    return imageList.find(imgName => {
        const imgNameWithoutSuffix=getImageNameWithoutSuffix(imgName);
        if (imgNameWithoutSuffix===imageNameWithoutSuffix) {
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
    let indexOfBeginSuffix = imgName.indexOf(METADATA_DELETED+".");
    if (indexOfBeginSuffix>0) {
        return true;
    }
    return false;
}

/**
 * This method returns the name without suffixes that are defined in: "imageSuffixes". 
 * @param name 
 */
export function getImageNameWithoutSuffix(name: string): string {
    let indexOfSuffix = imageSuffixes.findIndex(suffix => name.indexOf(suffix+".")>1);
    if (indexOfSuffix>-1) {
        return name.replace(imageSuffixes[indexOfSuffix],"");
    }
    return name;
}