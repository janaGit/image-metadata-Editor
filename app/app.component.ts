import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import { HTTP_PROVIDERS }    from 'angular2/http';

import {FileComponent} from './FileTab/file.component';
import {MetadataComponent} from './MetadataTab/metadata.component';
import {LocationComponent} from './LocationTab/location.component';
import {CompleteComponent} from './CompleteTab/complete.component';
import {ImageService}     from './services/image.service';

@Component({
    selector: 'my-app',
    providers: [ROUTER_PROVIDERS,HTTP_PROVIDERS,ImageService],
    directives: [ROUTER_DIRECTIVES, TAB_DIRECTIVES],
    template: `<div class='page-header'><h1> Image Metadata Editor </h1>
<span class="glyphicon glyphicon-edit" id="mainIcon" aria-hidden="true"></span></div>
<tabset>
<tab *ngFor="#tabz of tabs"
         [heading]="tabz.title"
         [disabled]="tabz.disabled"
        >
    </tab>
</tabset>
 <router-outlet></router-outlet>
`,
    styleUrls: ['app/app.component.css'],
})

@RouteConfig([
    {
        path: '/file',
        name: 'File',
        component: FileComponent,
        useAsDefault: true
    }, 
    {
        path: '/metadata',
        name: 'Metadata',
        component: MetadataComponent
    },
    {
        path: '/location',
        name: 'Location',
        component: LocationComponent
    },
    {
        path: '/complete',
        name: 'Complete',
        component: CompleteComponent
    }
])

export class AppComponent {
    public tabs: Array<any> = [
        { title: 'File' },
        { title: 'Metadata', disabled: true },
        { title: 'Location', disabled: true },
        { title: 'Complete', disabled: true }
    ];

}
