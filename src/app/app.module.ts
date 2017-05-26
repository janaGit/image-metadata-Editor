import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EditMetadataComponent } from './EditMetadata/editMetadata.component';
import { FileTabComponent } from './EditMetadata/FileTab/fileTab.component';
import { MetadataComponent } from './EditMetadata/MetadataTab/metadata.component';
import { LocationComponent } from './EditMetadata/LocationTab/location.component';
import { CompleteComponent } from './EditMetadata/CompleteTab/complete.component';
import { ImageGalleryComponent } from './ImageGallery/image_Gallery.component';
import { ContextMenuHolderComponent } from './modals/contextMenuHolder.component';
import { ShowMetadataComponent } from './modals/showMetadata.component';

import { OnMouseOverImageDirective } from './directives/onMouseOverImage.directive';
import { ReturnDropedImageDirective } from './directives/returnDropedImage.directive';


import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exifTool.service';
import { ContextMenuService } from './services/contextMenu.service';
import { EditorService } from './services/editor.service';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@NgModule({
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
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [EditorService, ImageService, ExifToolService, ContextMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
