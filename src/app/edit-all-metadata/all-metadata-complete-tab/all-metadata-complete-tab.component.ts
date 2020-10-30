import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataService } from 'app/edit-metadata/metadata.service';
import { EditorService } from 'app/services/editor.service';
import { ImageService } from 'app/services/image.service';
import { EditAllMetadataService } from '../edit-all-metadata.service';

@Component({
  selector: 'app-all-metadata-complete-tab',
  templateUrl: './all-metadata-complete-tab.component.html',
  styleUrls: ['./all-metadata-complete-tab.component.scss', '../../css/global-app.scss']
})
export class AllMetadataCompleteTabComponent implements OnInit {

  metadata: Object = {};
  metadataKeys: string[] = [];


  constructor(private _cdr: ChangeDetectorRef,
    private _editAllMetadataService: EditAllMetadataService,
      private _editorService: EditorService,
      private _router: Router,
      private _imageService: ImageService) {

  }


  ngOnDestroy(): void {

  }
  ngOnInit() {
      this.metadata = this._editAllMetadataService.metadataObject;
      this.metadataKeys = Object.keys(this.metadata).sort(this.shiftEditableKeysUp.bind(this));
  }

  async onClickSave() {
      this._editAllMetadataService.sendMetadataToBackendAndMoveToImageGallery();
      this._router.navigate(["image_gallery"]);
  }

  isEditableKey(key: string) {
      return this._editorService.isEditableKey(key);
  }

  isImportantMetadataKey(key: string) {
      return this._editorService.isImportantMetadataKey(key);
  }

  isEditableOrImportantKey(key: string) {
      return this.isEditableKey(key) || this.isImportantMetadataKey(key);
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
