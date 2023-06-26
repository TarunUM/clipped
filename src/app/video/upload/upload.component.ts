import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuidV4 } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from '../../services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  nextStepForm = false;
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Uploading...';
  alertColor = 'blue';
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  uploadTask?: AngularFireUploadTask;
  screenshots: string[] = [];
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegservice: FfmpegService
  ) {
    this.auth.user.subscribe((user) => {
      // obj will never be null because of the Route-Guards
      this.user = user;
    });
    this.ffmpegservice.init();
  }

  ngOnDestroy() {
    this.uploadTask?.cancel();
  }

  async storeFile($event: Event) {
    this.isDragOver = false;

    // As Chrome doesn't support direct access to the file we need to store it 'file' variable
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegservice.getScreenshots(this.file);

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStepForm = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Uploading...';
    this.inSubmission = true;
    this.showPercentage = true;

    const fileName = uuidV4();
    const filePath = `clipped/${fileName}.mp4`;
    this.uploadTask = this.storage.upload(filePath, this.file);
    const clipRef = this.storage.ref(filePath);

    this.uploadTask
      .percentageChanges()
      .subscribe((progress) => (this.percentage = (progress as number) / 100));
    this.uploadTask
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const fileData = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value as string,
            fileName: `${fileName}.mp4`,
            url,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          const clipDocRef = await this.clipsService.createClip(fileData);
          console.log(fileData);

          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is ready';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef?.id]);
          }, 1000);
        },
        error: (err) => {
          this.uploadForm.enable();
          this.alertMsg = 'Upload Failed! Please try again later';
          this.alertColor = 'red';
          this.showPercentage = false;
          this.inSubmission = false;
          console.error(err);
        },
      });
  }
}
