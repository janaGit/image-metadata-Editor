import { MetadataFromCategoriesTab } from "./metadata-from-categories-tab.interface"
import { MetadataFromMetadataTemplateTab } from "./metadata-from-metadata-template-tab.interface"
import { MetadataFromLocationTab } from "./metadata-from-location-tab.interface"
import { TemplateExistingMetadataType } from "./template-existing-metadata.type"

export interface AppTemplate {
    name: string;
    categoryTab: MetadataFromCategoriesTab;
    metadataTab: MetadataFromMetadataTemplateTab;
    locationTab: MetadataFromLocationTab;
    existingMetadataTab: TemplateExistingMetadataType
}