import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from '../metadata.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';


@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss', '../../css/global-app.scss']
})
export class CategoriesTabComponent implements OnInit, OnDestroy {

  allSelectedCategories: string[] = [];
  inputCategories: string[]=[];

  areNotSupportedCategoriesSelected = false;
  notSupprotedCategories = []
  notSupprotedCategoriesText = "Further categories from image: "

  _selectedCategories: string[] = [];
  set selectedCategories(selectedCategories: string[]) {
    this._selectedCategories = selectedCategories;
    this.updateMetadata();
  }
  get selectedCategories() {
    return this._selectedCategories;
  }


  constructor(private _editorService: EditorService, private _metadataService: MetadataService, private _metadataFromImageService: MetadataFromImageService, private _cdr: ChangeDetectorRef) {

  }

  ngOnDestroy(): void {
    this._metadataService.updateCategories({ categories: this.selectedCategories, areNotSupportedCategoriesSelected: this.areNotSupportedCategoriesSelected });;
  }

  ngOnInit() {

    let __categories = this._metadataService.categories;
    if (__categories) {
      this.inputCategories = __categories.categories;
      this.areNotSupportedCategoriesSelected = __categories.areNotSupportedCategoriesSelected;
    } else {
      this.inputCategories = this._metadataFromImageService.categories;
    }

    this.updateMetadata();

  }



  identifyNotSupportedCategories(categoriesOfTree: string[]) {
    const _categories = this._metadataFromImageService.categories;
    this.notSupprotedCategories = [];
    _categories?.forEach(category => {
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
