import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { EditorService } from 'app/services/editor.service';
import { EditTemplateService } from '../edit-template.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
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

  private _isSupportedCategoriesToCopy: boolean = false;
  set isSupportedCategoriesToCopy(isSupportedCategoriesToCopy: boolean) {
    this._isSupportedCategoriesToCopy = isSupportedCategoriesToCopy;
    this.sendMetadataToService();
  }
  get isSupportedCategoriesToCopy() {
    return this._isSupportedCategoriesToCopy;
  }


  private _isNotSupportedCategoriesToCopy: boolean = false;
  set isNotSupportedCategoriesToCopy(isNotSupportedCategoriesToCopy: boolean) {
    this._isNotSupportedCategoriesToCopy = isNotSupportedCategoriesToCopy;
    this.sendMetadataToService();
  }
  get isNotSupportedCategoriesToCopy() {
    return this._isNotSupportedCategoriesToCopy;
  }

  allSelectedCategories: string[] = [];
  inputCategories: string[] = [];



  private _selectedCategories: string[] = [];
  set selectedCategories(selectedCategories: string[]) {
    this._selectedCategories = selectedCategories;
    this.updateMetadata();
    this.sendMetadataToService();
  }
  get selectedCategories() {
    return this._selectedCategories;
  }


  constructor(private _editTemplateService: EditTemplateService,
    private _metadataFromImageService: MetadataFromImageService,
    private _cdr: ChangeDetectorRef) {


  }

  ngOnDestroy(): void {

  }

  ngOnInit() {

    let __categories = this._editTemplateService.categories;

    this.inputCategories = __categories.categories;
    this.isSupportedCategoriesToCopy = __categories.isSupportedCategoriesToCopy;
    this.isNotSupportedCategoriesToCopy = __categories.isNotSupportedCategoriesToCopy;


    this.updateMetadata();
  }



  updateMetadata() {
    let categories = deepCopyFunction(this.selectedCategories);

    const uniqueCategories = categories.filter((item, index) => categories.indexOf(item) === index);

    this.allSelectedCategories = uniqueCategories;
  }

  sendMetadataToService() {
    this._editTemplateService.updateCategories({
      categories: this.allSelectedCategories,
      isSupportedCategoriesToCopy: this.isSupportedCategoriesToCopy,
      isNotSupportedCategoriesToCopy: this.isNotSupportedCategoriesToCopy
    });
  }

}
