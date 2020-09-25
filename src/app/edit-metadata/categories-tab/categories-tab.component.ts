import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from '../metadata.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { MetadataFromTemplateService } from '../metadata-from-template.service';
import { Subscription } from 'rxjs';
import { TemplateCategoriesTab } from 'app/types/template-categories-tab.interface';


@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss', '../../css/global-app.scss']
})
export class CategoriesTabComponent implements OnInit, OnDestroy {

  private _selectedCategories: string[] = [];
  set selectedCategories(selectedCategories: string[]) {
    this._selectedCategories = selectedCategories;
    this.updateMetadata();
  }
  get selectedCategories() {
    return this._selectedCategories;
  }

  allSelectedCategories: string[] = [];
  inputCategories: string[] = [];

  areNotSupportedCategoriesSelected = false;
  notSupprotedCategories = []
  notSupprotedCategoriesText = "Further categories from image: ";

  categoriesFromImage: string[];
  categoriesFromTemplate: string[];

  templateIsSupportedCategoriesToCopy: boolean;

  constructor(private _editorService: EditorService,
    private _metadataService: MetadataService,
    private _metadataFromImageService: MetadataFromImageService,
    private _cdr: ChangeDetectorRef,
    private _metadataFromTemplateService: MetadataFromTemplateService) {

  }

  ngOnDestroy(): void {
    this._metadataService.updateCategories({
      categories: this.allSelectedCategories,
      areNotSupportedCategoriesSelected: this.areNotSupportedCategoriesSelected
    });;
  }

  ngOnInit() {

    let __categories = this._metadataService.categories;

    this.inputCategories = __categories.categories;
    this.areNotSupportedCategoriesSelected = __categories.areNotSupportedCategoriesSelected;


    this.updateMetadata();

    if (this._metadataFromImageService.categories) {
      this.categoriesFromImage = this._metadataFromImageService.categories;
    }

    this.categoriesFromTemplate = this._metadataFromTemplateService.categories.categories;
    this.templateIsSupportedCategoriesToCopy = this._metadataFromTemplateService.categories.isNotSupportedCategoriesToCopy;

  }



  identifyNotSupportedCategories(categoriesOfTree: string[]) {
    this.notSupprotedCategories = [];
    if (this._metadataFromImageService.categories) {
      this._metadataFromImageService.categories.forEach(category => {
        if (category) {
          const indexOfCategory = categoriesOfTree.indexOf(category);
          if (indexOfCategory === -1) {
            this.notSupprotedCategories = this.notSupprotedCategories.concat(category);
          }
        }

      });
    }

  }
  onChangeSelectNotSupportedCategories(event) {
    this.areNotSupportedCategoriesSelected = event.checked;
    this.updateMetadata();

  }
  updateMetadata() {
    let categories = deepCopyFunction(this.selectedCategories);
    if (this.areNotSupportedCategoriesSelected) {
      this.notSupprotedCategories.forEach(_category => {
        categories.push(_category);
      })
    }
    const uniqueCategories = categories.filter((item, index) => categories.indexOf(item) === index);
    this.allSelectedCategories = uniqueCategories;
  }

  setCategoriesFromImage() {
    this.inputCategories = deepCopyFunction(this._metadataFromImageService.categories);
    const supportedCategories = this._editorService.getSupportedCategories();
    this.selectedCategories = this._metadataFromImageService.categories.filter((item, index) => supportedCategories.indexOf(item) !== -1);
    this.areNotSupportedCategoriesSelected = true;
    this.updateMetadata();

  }

  setCategoriesFromTemplate() {
    this.inputCategories = deepCopyFunction(this._metadataFromTemplateService.categories.categories);
    const supportedCategories = this._editorService.getSupportedCategories();
    this.selectedCategories = this._metadataFromTemplateService.categories.categories.filter((item, index) => supportedCategories.indexOf(item) !== -1);
    this.areNotSupportedCategoriesSelected = false;
    this.updateMetadata();

  }
}
