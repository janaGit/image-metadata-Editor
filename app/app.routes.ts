import { Routes } from '@angular/router';

import {EditMetadataComponent} from './EditMetadata/editMetadata.component';
import {ImageGalleryComponent} from './ImageGallery/image_Gallery.component';


export const routerConfig: Routes = [
     {
        path: '/edit_metadata',
        component: EditMetadataComponent
    },
    {
        path: '/image_gallery',
        component: ImageGalleryComponent,
    }
];