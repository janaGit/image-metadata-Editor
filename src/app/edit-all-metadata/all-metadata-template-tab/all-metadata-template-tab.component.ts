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

  selectedTemplate: Object;
  selectedTemplateKeys: string[];

  templateSubscription: Subscription;

  metadataObjectSubscription: Subscription;

  editAllMetadataFromTemplateServiceSubscription: Subscription;

  constructor(private _cdr: ChangeDetectorRef,
    private _editorService: EditorService,
    private _editAllMetadataFromTemplateService: EditAllMetadataFromTemplateService,
    private _editAllMetadataService: EditAllMetadataService) { }

  ngOnInit(): void {

    this.templateSubscription = this._editorService.templates$.subscribe(templates => {
      this.templates = new Map(templates);

      this.templateKeys = [...this.templates.keys()];
    })

    this.editAllMetadataFromTemplateServiceSubscription = this._editAllMetadataFromTemplateService.templateName$.subscribe(templateName => {
      if (templateName !== this.selectTemplate.value) {
        this.selectTemplate.setValue(templateName);
      }
    });

    this.metadataObjectSubscription = this._editAllMetadataService.metadataObject$.subscribe(metadataObject => {
      if (metadataObject != null) {
        this.selectedTemplate = metadataObject;
        this.selectedTemplateKeys = Object.keys(this.selectedTemplate).sort(this.shiftEditableKeysUp.bind(this));
      }
    });

  }

  ngOnDestroy() {
    this.templateSubscription.unsubscribe();
    this.metadataObjectSubscription.unsubscribe();
    this.editAllMetadataFromTemplateServiceSubscription.unsubscribe();
  }

  isImportantMetadataKey(key: string) {
    return this._editorService.isImportantMetadataKey(key);
  }
  isEditableKey(key: string) {
    return this._editorService.isEditableKey(key);
  }
  isEditableOrImportantKey(key: string) {
    return this.isEditableKey(key) || this.isImportantMetadataKey(key);
  }

  onChangeSelectTemplate(event) {
    this._editAllMetadataFromTemplateService.setTemplate(this.templates.get(event));
    this._editAllMetadataService.setMetadataFromAppTemplate(this._editAllMetadataFromTemplateService.getTemplate());
  }

  shiftEditableKeysUp(this, a, b) {
    if (!this.isEditableOrImportantKey(a) && this.isEditableOrImportantKey(b)) {
      return 1;
    }
    if (this.isEditableOrImportantKey(a) && !this.isEditableOrImportantKey(b)) {
      return -1;
    }
    if ([a, b].sort()[0] === a) {
      return -1;
    } else {
      return 1;
    }

  };
}