import { ExistingMetadataTemplateTabComponent } from 'app/edit-template/existing-metadata-template-tab/existing-metadata-template-tab.component';
import { ExistingMetadataTemplateMethods } from './existing-metadata-templete-methods.type';

export interface TemplateMetadataKeys {
    keys: string[];
    method: ExistingMetadataTemplateMethods.COPY_CUSTOM | ExistingMetadataTemplateMethods.DELETE_CUSTOM
}