import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ScService } from './sc.service';

@Component({
  selector: 'sc-home',
  templateUrl: 'app/home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router, private _scService: ScService) {
    //this.filesToUpload = [];
  }

  fileToUpload: File;
  // filesToUpload: Array<File>; // For multiple files

  fileChangeEvent2(fileInput: any){
    this.fileToUpload = <File> fileInput.target.files[0];
    // this.filesToUpload = <Array<File>> fileInput.target.files; // For multiple files
  }

  onUploadClick() {
    this._scService.uploadFile(this.fileToUpload)
      .then((result) => {
        console.log(result);
      }, (error) => {
        console.error(error);
      });
  }

  ngOnInit() {
  }

}
