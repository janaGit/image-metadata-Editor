import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from 'app/services/metadata.service';
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.scss', '../../css/global-app.scss']
})
export class CategoriesTabComponent implements OnInit, OnDestroy {

  selectedCategories: string[] = [];

  areNotSupportedCategoriesSelected = false;
  notSupprotedCategories = []

  notSupprotedCategoriesText = "Further categories from image: "
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<CategoryFlatNode, CategoryNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<CategoryNode, CategoryFlatNode>();

  categoryNameNodeMap = new Map<string, CategoryFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: CategoryFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<CategoryNode, CategoryFlatNode>;

  dataSource: MatTreeFlatDataSource<CategoryNode, CategoryFlatNode>;

  subscriptionCategoryTree: Subscription;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(true /* multiple */);

  constructor(private _editorService: EditorService, private _metadataService: MetadataService, private _metadataFromImageService: MetadataFromImageService, private _cdr: ChangeDetectorRef) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }

  ngOnDestroy(): void {
    this._metadataService.updateCategories({ categories: this.selectedCategories, areNotSupportedCategoriesSelected: this.areNotSupportedCategoriesSelected });
    this.subscriptionCategoryTree.unsubscribe();
  }

  ngOnInit() {
    this.subscriptionCategoryTree = this._editorService.categoryTree.subscribe(treeData => {
      this.dataSource.data = this.buildTree(treeData, 0);
    });

    const __categories = this._metadataService.categories;
    if (__categories) {
      __categories.categories.forEach(category => {
        const flatNode = this.categoryNameNodeMap.get(category);
        if (typeof flatNode !== "undefined") {
          this.checklistSelection.select(flatNode);
        }
      });
      this.areNotSupportedCategoriesSelected = __categories.areNotSupportedCategoriesSelected;
    } else {
      const __categories = this._metadataFromImageService.categories;

      __categories.forEach(category => {
        const flatNode = this.categoryNameNodeMap.get(category);
        if (typeof flatNode !== "undefined") {
          this.checklistSelection.select(flatNode);
        }
      });
    }



    const _categories = this._metadataFromImageService.categories;
    _categories?.forEach(category => {
      const flatNode = this.categoryNameNodeMap.get(category);
      if (typeof flatNode === "undefined" && category !== null) {
        this.notSupprotedCategories = this.notSupprotedCategories.concat(category);
      }
    });

    this.updateMetadata();
  }

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => node.expandable;

  getChildren = (node: CategoryNode): CategoryNode[] => node.children;

  hasChild = (_: number, _nodeData: CategoryFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: CategoryNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new CategoryFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    this.categoryNameNodeMap.set(node.item, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the category item selection. Select/deselect all the descendants node */
  categoryItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    this.checklistSelection.deselect(...descendants);


    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

    this.updateMetadata();
  }

  /** Toggle a leaf category item selection. Check all the parents to see if they changed */
  categoryLeafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.updateMetadata();
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CategoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  buildTree(obj: { [key: string]: any }, level: number): CategoryNode[] {
    return Object.keys(obj).reduce<CategoryNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new CategoryNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  onChangeSelectNotSupportedCategories(event) {
    this.areNotSupportedCategoriesSelected = event.checked;
    this.updateMetadata();

  }
  updateMetadata() {
    const categories = [];
    this.checklistSelection.selected.forEach(category => {
      categories.push(category.item);
      let parent = this.getParentNode(category);
      while (parent) {
        categories.push(parent.item);
        parent = this.getParentNode(parent);
      }
    })
    if (this.areNotSupportedCategoriesSelected) {
      this.notSupprotedCategories.forEach(_category => {
        categories.push(_category);
      })
    }
    const uniqueCategories = categories.filter((item, index) => categories.indexOf(item) === index);
    this.selectedCategories = uniqueCategories;
  }
}
