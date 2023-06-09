import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/iclip.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  clips: IClip[] = [];
  videoOrder = '1';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
    });

    this.clipService.getClips().subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  openModal(event: Event, clip: IClip) {
    event.preventDefault();

    this.modal.toggleModal('editClip');
  }
}
