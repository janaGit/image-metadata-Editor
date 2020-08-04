/* from: https://material.angular.io/components/tree/examples */
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { EditorService } from 'app/services/editor.service';
import { MetadataService } from 'app/services/metadata.service';
import { CategoriesTabComponent } from 'app/edit-metadata/categories-tab/categories-tab.component';
import { first } from 'rxjs/operators'
import { MetadataFromImageService } from 'app/services/metadata-from-image.service';
import { FormControl } from '@angular/forms';

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


/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.scss', '../css/global-app.scss'],
})
export class TreeComponent implements OnInit {
  selectedCategories: string[];

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

  /** The selection for checklist */
  checklistSelection = new SelectionModel<CategoryFlatNode>(true /* multiple */);

  constructor(private _editorService: EditorService, private _metadataService: MetadataService, private _metadataFromImageService: MetadataFromImageService, private _cdr: ChangeDetectorRef) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }
  ngOnInit() {
    this._editorService.categoryTree$.subscribe(data => {
      this.dataSource.data = this.buildTree(data, 0);
    });

    this._metadataService.categories$.pipe(first()).subscribe(categories => {
      categories.forEach(category => {
        const flatNode = this.categoryNameNodeMap.get(category);
        if (typeof flatNode !== "undefined") {
          this.categoryItemSelectionToggle(flatNode);
        }

      });
    });
    this._metadataFromImageService.categories$.pipe(first()).subscribe(categories => {
      categories.forEach(category => {
        const flatNode = this.categoryNameNodeMap.get(category);
        if (typeof flatNode === "undefined") {
          this.notSupprotedCategories = this.notSupprotedCategories.concat(category);
        }

      })

    });

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
    this._metadataService.updateCategories(uniqueCategories);
    this.selectedCategories = uniqueCategories;
  }
}
