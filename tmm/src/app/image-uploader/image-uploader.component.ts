import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  imageUploaded(event) {
    console.log(event.file);
  }
}
