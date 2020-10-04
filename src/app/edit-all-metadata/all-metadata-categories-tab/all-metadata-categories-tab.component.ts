import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { EditorService } from 'app/services/editor.service';
import { EditAllMetadataService } from '../edit-all-metadata.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { Subscription } from 'rxjs';
import { areArraysEqual, deepCopyFunction } from '../../../../utilities/utilitiy-methods';
import { EditAllMetadataFromTemplateService } from '../edit-all-metadata-from-template.service';

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
  selector: 'app-all-metadata-categories-tab',
  templateUrl: './all-metadata-categories-tab.component.html',
  styleUrls: ['./all-metadata-categories-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataCategoriesTabComponent implements OnInit, OnDestroy {

  areArraysEqual = areArraysEqual;

  private _isSupportedCategoriesToCopy: boolean = false;
  set isSupportedCategoriesToCopy(isSupportedCategoriesToCopy: boolean) {
    this._isSupportedCategoriesToCopy = isSupportedCategoriesToCopy;
  }
  get isSupportedCategoriesToCopy() {
    return this._isSupportedCategoriesToCopy;
  }


  private _isNotSupportedCategoriesToCopy: boolean = false;
  set isNotSupportedCategoriesToCopy(isNotSupportedCategoriesToCopy: boolean) {
    this._isNotSupportedCategoriesToCopy = isNotSupportedCategoriesToCopy;
  }
  get isNotSupportedCategoriesToCopy() {
    return this._isNotSupportedCategoriesToCopy;
  }

  allSelectedCategories: string[] = [];


  private _inputCategories: string[] = [];
  set inputCategories(inputCategories: string[]) {
    this._inputCategories = inputCategories;
  }
  get inputCategories() {
    return this._inputCategories;
  }

  categoriesFromTemplate: string[] = [];
  templateIsNotSupportedCategoriesToCopy: boolean;
  templateIsSupportedCategoriesToCopy: boolean;


  private _selectedCategories: string[] = [];
  set selectedCategories(selectedCategories: string[]) {
    this._selectedCategories = selectedCategories;
    this.updateMetadata();
  }
  get selectedCategories() {
    return this._selectedCategories;
  }


  constructor(private _editAllMetadataService: EditAllMetadataService,
    private _metadataFromImageService: MetadataFromImageService,
    private _cdr: ChangeDetectorRef,
    private _editAllMetadataFromTemplateService: EditAllMetadataFromTemplateService) {


  }

  ngOnDestroy(): void {
    this.sendMetadataToService();
  }

  ngOnInit() {

    let __categories = this._editAllMetadataService.categories;

    this.inputCategories = __categories.categories;
    this.isSupportedCategoriesToCopy = __categories.isSupportedCategoriesToCopy;
    this.isNotSupportedCategoriesToCopy = __categories.isNotSupportedCategoriesToCopy;

    this.categoriesFromTemplate = this._editAllMetadataFromTemplateService.categories.categories;
    this.templateIsNotSupportedCategoriesToCopy = this._editAllMetadataFromTemplateService.categories.isNotSupportedCategoriesToCopy;
    this.templateIsSupportedCategoriesToCopy = this._editAllMetadataFromTemplateService.categories.isSupportedCategoriesToCopy;

    this.updateMetadata();
  }



  updateMetadata() {
    let categories = deepCopyFunction(this.selectedCategories);

    const uniqueCategories = categories.filter((item, index) => categories.indexOf(item) === index);

    this.allSelectedCategories = uniqueCategories;
  }

  sendMetadataToService() {
    this._editAllMetadataService.updateCategories({
      categories: this.allSelectedCategories,
      isSupportedCategoriesToCopy: this.isSupportedCategoriesToCopy,
      isNotSupportedCategoriesToCopy: this.isNotSupportedCategoriesToCopy
    });
  }

  setFromTemplate() {
    this.inputCategories = deepCopyFunction(this._editAllMetadataFromTemplateService.categories.categories);
    this.selectedCategories = deepCopyFunction(this._editAllMetadataFromTemplateService.categories.categories);
    this._isNotSupportedCategoriesToCopy = this.templateIsNotSupportedCategoriesToCopy;
    this._isSupportedCategoriesToCopy = this.templateIsSupportedCategoriesToCopy;


  }
}
