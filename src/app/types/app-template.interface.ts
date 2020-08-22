import { TemplateCategoriesTab } from "./template-categories-tab.interface"
import { MetadataFromMetadataTemplateTab } from "./metadata-from-metadata-template-tab.interface"
import { TemplateExistingMetadataType } from "./template-existing-metadata.type"
import { TemplateLocationTab } from './template-location-tab.interface'

export interface AppTemplate {
    name: string;
    categoryTab: TemplateCategoriesTab;
    metadataTab: MetadataFromMetadataTemplateTab;
    locationTab: TemplateLocationTab;
    existingMetadataTab: TemplateExistingMetadataType
}