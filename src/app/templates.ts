import { AppTemplate } from "./types/app-template.interface";
import { ExistingMetadataTemplateMethods } from "./types/existing-metadata-templete-methods.type";
export const EMPTY_TEMPLATE = "EMPTY TEMPLATE";

export const emptyTemplate: AppTemplate = {
    name: EMPTY_TEMPLATE,
    categoryTab: {
        isNotSupportedCategoriesToCopy: false,
        isSupportedCategoriesToCopy: false,
        categories: []
    },
    existingMetadataTab: {
        keys:[],
        method: ExistingMetadataTemplateMethods.DELETE_ALL,
    },
    locationTab: {
        dateAndTime: undefined,
        isLocationDisabledByDefault: false,
        isTimeDisabledByDefault: false,
        latitude: undefined,
        longitude: undefined,
        isLocationCopiedFromImage: false,
        isTimeCopiedFromImage: false
    },
    metadataTab: {
        contactInfo: "",
        isContactInfoCopiedFromImage: false,
        creator: "",
        isCreatorCopiedFromImage: false,
        description: "",
        isDescriptionCopiedFromImage: false,
        keywords: [],
        areKeywordsCopiedFromImage: false,
        license: "",
        isLicenseCopiedFromImage: false,
        subject: "",
        isSubjectCopiedFromImage: false
    }
}
export const IMAGE_COPY_TEMPLATE = "IMAGE COPY TEMPLATE";

export const imageCopyTemplate: AppTemplate = {
    name: IMAGE_COPY_TEMPLATE,
    categoryTab: {
        isNotSupportedCategoriesToCopy: true,
        isSupportedCategoriesToCopy: true,
        categories: []
    },
    existingMetadataTab: {
        keys:[],
        method: ExistingMetadataTemplateMethods.COPY_ALL,
    },
    locationTab: {
        dateAndTime: undefined,
        isLocationDisabledByDefault: false,
        isTimeDisabledByDefault: false,
        latitude: undefined,
        longitude: undefined,
        isLocationCopiedFromImage: true,
        isTimeCopiedFromImage: true
    },
    metadataTab: {
        contactInfo: "",
        isContactInfoCopiedFromImage: true,
        creator: "",
        isCreatorCopiedFromImage: true,
        description: "",
        isDescriptionCopiedFromImage: true,
        keywords: [],
        areKeywordsCopiedFromImage: true,
        license: "",
        isLicenseCopiedFromImage: true,
        subject: "",
        isSubjectCopiedFromImage: true
    }
}