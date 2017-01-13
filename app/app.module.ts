import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { DropdownModule, TabsModule } from 'ng2-bootstrap';

import { routerConfig } from './app.routes';
import { AppComponent } from './app.component';

import { OnMouseOverImageDirective } from './directives/onMouseOverImage.directive';
import { GetDropedImageDirective } from './directives/getDropedImage.directive';

import { ContextMenuHolderComponent } from './modals/contextMenuHolder.component';
import { ShowMetadataComponent } from './modals/showMetadata.component';

import { FileComponent } from './EditMetadata/FileTab/file.component';
import { MetadataComponent } from './EditMetadata/MetadataTab/metadata.component';
import { LocationComponent } from './EditMetadata/LocationTab/location.component';
import { CompleteComponent } from './EditMetadata/CompleteTab/complete.component';
@NgModule({
  imports: [BrowserModule, HttpModule,
    RouterModule.forRoot(routerConfig, { useHash: true }),
    DropdownModule.forRoot(),
    TabsModule.forRoot()
  ],
  declarations: [
    AppComponent,
    FileComponent,
    LocationComponent,
    MetadataComponent,
    CompleteComponent,
    ShowMetadataComponent,
    ContextMenuHolderComponent,
    GetDropedImageDirective,
    OnMouseOverImageDirective,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
