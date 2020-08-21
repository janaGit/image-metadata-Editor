import { TemplateCategoriesTab } from "./template-categories-tab.interface"
import { MetadataFromMetadataTemplateTab } from "./metadata-from-metadata-template-tab.interface"
import { MetadataFromLocationTab } from "./metadata-from-location-tab.interface"
import { TemplateExistingMetadataType } from "./template-existing-metadata.type"

export interface AppTemplate {
    name: string;
    categoryTab: TemplateCategoriesTab;
    metadataTab: MetadataFromMetadataTemplateTab;
    locationTab: MetadataFromLocationTab;
    existingMetadataTab: TemplateExistingMetadataType
}