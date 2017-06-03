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
import { ContextMenuHolderComponent } from './modals/context-menu-holder/context-menu-holder.component';
import { ShowMetadataComponent } from './modals/show-metadata/show-metadata.component';

import { OnMouseOverImageDirective } from './directives/onMouseOverImage.directive';
import { ReturnDropedImageDirective } from './directives/returnDropedImage.directive';


import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exif-tool.service';
import { ContextMenuService } from './services/context-menu.service';
import { EditorService } from './services/editor.service';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BottomBarComponent } from './modals/bottom-bar/bottom-bar.component';
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
    OnMouseOverImageDirective,
    BottomBarComponent
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
