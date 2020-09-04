import { ExistingMetadataTemplateTabComponent } from 'app/edit-template/existing-metadata-template-tab/existing-metadata-template-tab.component';
import { ExistingMetadataTemplateMethods } from './existing-metadata-templete-methods.type';

export interface TemplateExistingMetadata {
    keys: string[];
    method: ExistingMetadataTemplateMethods
}