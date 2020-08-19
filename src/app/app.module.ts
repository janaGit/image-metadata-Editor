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

import{EditTemplateComponent} from './edit-template/edit-template.component';
import{StartTemplateTabComponent} from './edit-template/start-template-tab/start-template-tab.component';
import{CompleteTemplateTabComponent} from './edit-template/complete-template-tab/complete-template-tab.component';

import { ImageGalleryComponent } from './image-gallery/image-gallery.component';

import { ContextMenuHolderComponent } from './modals/context-menu-holder/context-menu-holder.component';
import { ShowMetadataComponent } from './modals/show-metadata/show-metadata.component';

import { OnMouseOverImageDirective } from './directives/on-mouse-over-image.directive';
import { ReturnDropedImageDirective } from './directives/return-droped-image.directive';


import { ImageService } from './services/image.service';
import { ExifToolService } from './services/exif-tool.service';
import { ContextMenuService } from './services/context-menu.service';
import { EditorService } from './services/editor.service';
import { MetadataService } from './edit-metadata/metadata.service';
import { MetadataFromImageService } from './edit-metadata/metadata-from-image.service';
import { EditTemplateService } from './edit-template/edit-template.service';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BottomBarComponent } from './modals/bottom-bar/bottom-bar.component';
import { BottomBarCompleteImgComponent } from './bottom-bar-complete-img/bottom-bar-complete-img.component';
import { ImeTooltipDirecive } from './directives/ime-tooltip.directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import  './font-awesome';
import 'typeface-roboto';
import { AppModalComponent } from './modals/app-modal/app-modal.component';
import { ModalShowProgressComponent } from './modals/modal-show-progress/modal-show-progress.component';
import { MapComponent } from './map/map.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AddItemsComponent } from './add-items/add-items.component';
import { TemplateTabComponent } from './edit-metadata/template-tab/template-tab.component';
import { CategoriesTabComponent } from './edit-metadata/categories-tab/categories-tab.component';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { InputTemplateButtonsComponent } from './input-template-buttons/input-template-buttons.component';
import { ExistingMetadataTemplateTabComponent } from './edit-template/existing-metadata-template-tab/existing-metadata-template-tab.component';
import { AddItemsVerticalComponent } from './add-items-vertical/add-items-vertical.component';
import { EditMetadataTemplateTabComponent } from './edit-template/edit-metadata-template-tab/edit-metadata-template-tab.component';
import { CategoriesTemplateTabComponent } from './edit-template/categories-template-tab/categories-template-tab.component';
import { SelectCategoryTreeComponent } from './select-category-tree/select-category-tree.component';

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
    AddItemsComponent,
    TemplateTabComponent,
    CategoriesTabComponent,
    InputTemplateButtonsComponent,
    StartTemplateTabComponent,
    CompleteTemplateTabComponent,
    EditTemplateComponent,
    ExistingMetadataTemplateTabComponent,
    AddItemsVerticalComponent,
    EditMetadataTemplateTabComponent,
    CategoriesTemplateTabComponent,
    SelectCategoryTreeComponent
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
    TimepickerModule.forRoot(),
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers: [EditorService, ImageService, ExifToolService, ContextMenuService,MetadataService, MetadataFromImageService, EditTemplateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
