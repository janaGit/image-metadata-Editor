import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { EditorService } from 'app/services/editor.service';
import { EditTemplateService } from '../edit-template.service';
import { MetadataFromImageService } from 'app/edit-metadata/metadata-from-image.service';
import { Subscription } from 'rxjs';
import { deepCopyFunction } from '../../../../utilities/utilitiy-methods';

/**
 * Node for category item
 */
export class CategoryNode {
  children: CategoryNode[];
  item: string;
}

/** Flat category item node with expandable and level information */
export class CategoryFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}


@Component({
  selector: 'app-categories-template-tab',
  templateUrl: './categories-template-tab.component.html',
  styleUrls: ['./categories-template-tab.component.scss', '../../css/global-app.scss']
})
export class CategoriesTemplateTabComponent implements OnInit, OnDestroy {

  areNotSupportedCategoriesSelected = false;
  notSupprotedCategories = []
  notSupprotedCategoriesText = "Further categories from image: "

  allSelectedCategories: string[] = [];
  inputCategories: string[]=[];


    
  _selectedCategories: string[] = [];
  set selectedCategories(selectedCategories: string[]) {
    this._selectedCategories = selectedCategories;
    this.updateMetadata();
  }
  get selectedCategories() {
    return this._selectedCategories;
  }


  constructor(private _editTemplateService: EditTemplateService, private _metadataFromImageService: MetadataFromImageService, private _cdr: ChangeDetectorRef) {


  }

  ngOnDestroy(): void {
    this._editTemplateService.updateCategories({ categories: this.selectedCategories, areNotSupportedCategoriesSelected: this.areNotSupportedCategoriesSelected });
  }

  ngOnInit() {

    let __categories = this._editTemplateService.categories;
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
