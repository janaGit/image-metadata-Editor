import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { DropdownModule, TabsModule } from 'ng2-bootstrap';

import { routerConfig } from './app.routes';
import { AppComponent } from './app.component';

import { OnMouseOverImageDirective } from './directives/onMouseOverImage.directive';
import { ReturnDropedImageDirective } from './directives/returnDropedImage.directive';

import { ContextMenuHolderComponent } from './modals/contextMenuHolder.component';
import { ShowMetadataComponent } from './modals/showMetadata.component';

import { EditMetadataComponent } from './EditMetadata/editMetadata.component';
import { FileTabComponent } from './EditMetadata/FileTab/fileTab.component';
import { MetadataComponent } from './EditMetadata/MetadataTab/metadata.component';
import { LocationComponent } from './EditMetadata/LocationTab/location.component';
import { CompleteComponent } from './EditMetadata/CompleteTab/complete.component';

import { ImageGalleryComponent } from './ImageGallery/image_Gallery.component';

import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exifTool.service';
import { ContextMenuService } from './services/contextMenu.service';
import {EditorService} from './services/editor.service';

@NgModule({
  imports: [BrowserModule, HttpModule,
    RouterModule.forRoot(routerConfig, { useHash: true }),
    DropdownModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [EditorService,ImageService, ExifToolService, ContextMenuService ],
  declarations: [
    AppComponent,
    EditMetadataComponent,
    FileTabComponent,
    LocationComponent,
    MetadataComponent,
    CompleteComponent,
    ImageGalleryComponent,
    ShowMetadataComponent,
    ContextMenuHolderComponent,
    ReturnDropedImageDirective,
    OnMouseOverImageDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
