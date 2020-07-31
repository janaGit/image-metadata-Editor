import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { AppComponent } from './app.component';
import { BottomBarOriginalImgComponent } from './bottom-bar-original-img/bottom-bar-original-img.component';

import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { FileTabComponent } from './edit-metadata/file-tab/file-tab.component';
import { MetadataTabComponent } from './edit-metadata/metadata-tab/metadata-tab.component';
import { MoreMetadataTabComponent } from './edit-metadata/more-metadata-tab/more-metadata-tab.component';
import { LocationTabComponent } from './edit-metadata/location-tab/location-tab.component';
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
import { ImeTooltipDirecive } from './directives/ime-tooltip.directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import  './font-awesome';
import { AppModalComponent } from './modals/app-modal/app-modal.component';
import { ModalShowProgressComponent } from './modals/modal-show-progress/modal-show-progress.component';
import { MapComponent } from './map/map.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AddItemsComponent } from './add-items/add-items.component';
@NgModule({
  declarations: [
    AppComponent,
    EditMetadataComponent,
    FileTabComponent,
    LocationTabComponent,
    MetadataTabComponent,
    MoreMetadataTabComponent,
    CompleteComponent,
    ImageGalleryComponent,
    ShowMetadataComponent,
    ContextMenuHolderComponent,
    ReturnDropedImageDirective,
    OnMouseOverImageDirective,
    ImeTooltipDirecive,
    BottomBarComponent,
    BottomBarOriginalImgComponent,
    BottomBarCompleteImgComponent,
    AppModalComponent,
    ModalShowProgressComponent,
    MapComponent,
    AddItemsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ProgressbarModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [EditorService, ImageService, ExifToolService, ContextMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
