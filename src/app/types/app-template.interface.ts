import { MetadataFromCategoriesTab } from "./metadata-from-categories-tab.interface"
import { MetadataFromMetadataTab } from "./metadata-from-metadata-tab.interface"
import { MetadataFromLocationTab } from "./metadata-from-location-tab.interface"
import { TemplateMetadataKeys } from "./template-metadata-keys.interface"

export interface AppTemplate {
    name: string;
    categoryTab: MetadataFromCategoriesTab;
    metadataTab: MetadataFromMetadataTab;
    locationTab: MetadataFromLocationTab;
    existingMetadataTab: TemplateMetadataKeys
}