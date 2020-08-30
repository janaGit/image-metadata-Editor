import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from '../metadata.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
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
    if (__categories) {
      this.inputCategories = __categories.categories;
      this.areNotSupportedCategoriesSelected = __categories.areNotSupportedCategoriesSelected;
    } else {
      this.inputCategories = this._metadataFromImageService.categories.split(",");
    }

    this.updateMetadata();

  }



  identifyNotSupportedCategories(categoriesOfTree: string[]) {
    this.notSupprotedCategories = [];
    this._metadataFromImageService.categories.forEach(category => {
      if (category) {
        const indexOfCategory = categoriesOfTree.indexOf(category);
        if (indexOfCategory === -1) {
          this.notSupprotedCategories = this.notSupprotedCategories.concat(category);
        }
      }

    });
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
}
