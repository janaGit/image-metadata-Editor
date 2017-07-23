import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { Logger } from "angular2-logger/core";

import { AppComponent } from './app.component';
import { BottomBarOriginalImgComponent } from './bottom-bar-original-img/bottom-bar-original-img.component';

import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { FileTabComponent } from './edit-metadata/file-tab/file-tab.component';
import { MetadataComponent } from './edit-metadata/metadata-tab/metadata-tab.component';
import { LocationComponent } from './edit-metadata/location-tab/location-tab.component';
import { CompleteComponent } from './edit-metadata/complete-tab/complete-tab.component';

import { ImageGalleryComponent } from './image-gallery/image-gallery.component';

import { ContextMenuHolderComponent } from './modals/context-menu-holder/context-menu-holder.component';
import { ShowMetadataComponent } from './modals/show-metadata/show-metadata.component';

import { OnMouseOverImageDirective } from './directives/on-mouse-over-image.directive';
import { ReturnDropedImageDirective } from './directives/return-droped-image.directive';


import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exif-tool.service';
import { ContextMenuService } from './services/context-menu.service';
import { EditorService } from './services/editor.service';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BottomBarComponent } from './modals/bottom-bar/bottom-bar.component';
import { BottomBarCompleteImgComponent } from './bottom-bar-complete-img/bottom-bar-complete-img.component';
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
    BottomBarComponent,
    BottomBarOriginalImgComponent,
    BottomBarCompleteImgComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [Logger, EditorService, ImageService, ExifToolService, ContextMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
