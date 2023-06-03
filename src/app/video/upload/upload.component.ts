import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  isDragOver = false;
  file: File | null = null;
  nextStepForm = false;
  submission = false;

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  uploadForm = new FormGroup({
    title: this.title,
  });

  storeFile($event: Event) {
    this.isDragOver = false;

    // As Chrome doesn't support direct access to the file we need to store it 'file' variable
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStepForm = true;
    console.log(this.file);
  }

  uploadFile() {
    this.submission = true;
    console.log('Form Submitted');
    setTimeout(() => {
      this.submission = false;
    }, 3000);
  }
}
