import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ExifToolService } from 'app/services/exif-tool.service';
import { EditorService } from 'app/services/editor.service';
import { EditTemplateService } from 'app/edit-template/edit-template.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditAllMetadataFromTemplateService } from '../edit-all-metadata-from-template.service';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { EMPTY_TEMPLATE, emptyTemplate } from 'app/templates';


@Component({
  selector: 'app-all-metadata-template-tab',
  templateUrl: './all-metadata-template-tab.component.html',
  styleUrls: ['./all-metadata-template-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataTemplateTabComponent implements OnInit, OnDestroy {
  templates: Map<string, AppTemplate> = new Map();
  templateKeys: string[];

  selectTemplate = new FormControl("");

  templateSubscription: Subscription;

  metadataFromTemplateServiceSubscription: Subscription;

  constructor(private _cdr: ChangeDetectorRef,
    private _editorService: EditorService,
    private _metadataFromTemplateService: EditAllMetadataFromTemplateService,
    private _metadataService: EditAllMetadataService) { }

  ngOnInit(): void {

    this.templateSubscription = this._editorService.templates$.subscribe(templates => {
      this.templates = new Map(templates);

      this.templateKeys = [...this.templates.keys()];

    })

    this.metadataFromTemplateServiceSubscription = this._metadataFromTemplateService.templateName$.subscribe(templateName => {
      if (templateName !== this.selectTemplate.value) {
        this.selectTemplate.setValue(templateName);
      } 
      
    });

  }

  ngOnDestroy() {
    this.templateSubscription.unsubscribe();
  }

  onChangeSelectTemplate(event) {
    this._metadataFromTemplateService.setTemplate(this.templates.get(event));
    this._metadataService.setMetadataFromAppTemplate(this._metadataFromTemplateService.getTemplate());
  }

}