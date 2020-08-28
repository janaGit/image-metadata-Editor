import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ExifToolService } from 'app/services/exif-tool.service';
import { EditorService } from 'app/services/editor.service';
import { EditTemplateService } from 'app/edit-template/edit-template.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
const NO_TEMPLATE = "NO TEMPLATE";

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss', '../../css/global-app.scss']
})
export class TemplateTabComponent implements OnInit, OnDestroy {
  templates: Map<string, AppTemplate> = new Map();
  templateKeys: string[];

  selectTemplate = new FormControl("");

  templateSubscription: Subscription;

  constructor(private _cdr: ChangeDetectorRef, private _editorService: EditorService, private _metadataFromTemplateService: MetadataFromTemplateService) { }

  ngOnInit(): void {

    this.templateSubscription = this._editorService.templates$.subscribe(templates => {
      this.templates = new Map(templates);

      this.templateKeys = [NO_TEMPLATE, ...this.templates.keys()];

      this.selectTemplate.setValue(NO_TEMPLATE);

    })

  }

  ngOnDestroy() {
    this.templateSubscription.unsubscribe();
  }

  onChangeSelectTemplate(event) {
    this._metadataFromTemplateService.setTemplate(this.templates.get(event));
  }

}
