import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap';

import { routerConfig } from './app.routes';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule,
   RouterModule.forRoot(routerConfig, { useHash: true }),
   DropdownModule.forRoot()
   ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
