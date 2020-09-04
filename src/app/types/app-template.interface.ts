import { TemplateCategoriesTab } from "./template-categories-tab.interface"
import { MetadataFromMetadataTemplateTab } from "./metadata-from-metadata-template-tab.interface"
import { TemplateLocationTab } from './template-location-tab.interface'
import { TemplateExistingMetadata } from './template-existing-metadata.interface'

export interface AppTemplate {
    name: string;
    categoryTab: TemplateCategoriesTab;
    metadataTab: MetadataFromMetadataTemplateTab;
    locationTab: TemplateLocationTab;
    existingMetadataTab: TemplateExistingMetadata
}