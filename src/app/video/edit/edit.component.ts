import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/iclip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() activateClip: IClip | null = null;
  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor = 'blue';
  alertMsg = 'Please Wait your Clip is updating...';
  @Output() update = new EventEmitter<IClip>();

  clipId = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required, Validators.minLength(5)]);

  modalForm = new FormGroup({
    clipId: this.clipId,
    title: this.title,
  });

  constructor(private modal: ModalService, private clipsService: ClipService) {}

  ngOnInit() {
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unregister('editClip');
  }

  ngOnChanges() {
    if (!this.activateClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.title.setValue(this.activateClip.title);
    this.clipId.setValue(this.activateClip.docId!);
  }

  async submit() {
    if (!this.activateClip) {
      return;
    }

    this.showAlert = true;
    this.inSubmission = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait your clip updating...';

    try {
      await this.clipsService.updateClip(
        this.clipId.value as string,
        this.title.value as string
      );
    } catch (e) {
      this.showAlert = true;
      this.inSubmission = true;
      this.alertColor = 'red';
      this.alertMsg = 'Failed, Please try again later...';
    }
    this.activateClip.title = this.title.value as string;
    this.update.emit(this.activateClip);
    this.inSubmission = false;
    this.showAlert = true;
    this.alertColor = 'green';
    this.alertMsg = 'Success...';
  }
}
