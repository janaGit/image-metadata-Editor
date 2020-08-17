import { ExistingMetadataTemplateMethods } from './existing-metadata-templete-methods.type';

export interface TemplateExistingMetadataAll {
    method: ExistingMetadataTemplateMethods.COPY_ALL | ExistingMetadataTemplateMethods.DELETE_ALL
}