import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ExifToolService } from 'app/services/exif-tool.service';
import { EditorService } from 'app/services/editor.service';
import { EditTemplateService } from 'app/edit-template/edit-template.service';
import { AppTemplate } from 'app/types/app-template.interface';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
import { ExistingMetadataTemplateMethods } from 'app/types/existing-metadata-templete-methods.type';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { MetadataService } from '../metadata.service';
const NO_TEMPLATE = "NO TEMPLATE";

const noTemplate: AppTemplate = {
  name: "",
  categoryTab: {
    isNotSupportedCategoriesToCopy: false,
    isSupportedCategoriesToCopy: false,
    categories: []
  },
  existingMetadataTab: {
    method: ExistingMetadataTemplateMethods.COPY_ALL,
  },
  locationTab: {
    dateAndTime: undefined,
    isLocationDisabledByDefault: false,
    isTimeDisabledByDefault: false,
    latitude: undefined,
    longitude: undefined,
    isLocationCopiedFromImage: false,
    isTimeCopiedFromImage: false
  },
  metadataTab: {
    contactInfo: "",
    isContactInfoCopiedFromImage: false,
    creator: "",
    isCreatorCopiedFromImage: false,
    description: "",
    isDescriptionCopiedFromImage: false,
    keywords: [],
    areKeywordsCopiedFromImage: false,
    license: "",
    isLicenseCopiedFromImage: false,
    subject: "",
    isSubjectCopiedFromImage: false
  }
}

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

  metadataFromTemplateServiceSubscription: Subscription;

  constructor(private _cdr: ChangeDetectorRef, private _editorService: EditorService, private _metadataFromTemplateService: MetadataFromTemplateService, private _metadataService: MetadataService) { }

  ngOnInit(): void {

    this.templateSubscription = this._editorService.templates$.subscribe(templates => {
      this.templates = new Map(templates);
      this.templates.set(noTemplate.name, deepCopyFunction(noTemplate));

      this.templateKeys = [...this.templates.keys()];

    })

    this.metadataFromTemplateServiceSubscription = this._metadataFromTemplateService.templateName$.subscribe(templateName => {
      if (templateName !== this.selectTemplate.value) {
        this.selectTemplate.setValue(templateName);
      }

    })

  }

  ngOnDestroy() {
    this.templateSubscription.unsubscribe();
  }

  onChangeSelectTemplate(event) {
    this._metadataFromTemplateService.setTemplate(this.templates.get(event));
    this._metadataService.setMetadataFromAppTemplate(this._metadataFromTemplateService.getTemplate());
  }

}
