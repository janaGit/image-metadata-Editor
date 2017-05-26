import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditMetadataComponent } from './EditMetadata/editMetadata.component';
import { ImageGalleryComponent } from './ImageGallery/image_Gallery.component';

const routes: Routes = [
    {
        path: 'edit_metadata',
        component: EditMetadataComponent
    },
    {
        path: 'image_gallery',
        component: ImageGalleryComponent,
    },
    {
        path: '**',
        redirectTo: '/edit_metadata',
        pathMatch: 'full',    
    }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}