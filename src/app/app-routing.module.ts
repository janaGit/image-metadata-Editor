import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';

const routes: Routes = [
    {
        path: 'edit_metadata',
        component: EditMetadataComponent
    },
    {
        path: 'edit_templates',
        component: EditTemplateComponent
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