import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/iclip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  clips: IClip[] = [];
  videoOrder = '1';
  activateClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.videoOrder = params['sort'] == '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getClips(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  // TODO: BehaviouralSubject Observer
  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigateByUrl(`/manage?sort=${value}`);
  }

  openModal(event: Event, clip: IClip) {
    event.preventDefault();
    this.activateClip = clip;
    this.modal.toggleModal('editClip');
  }

  update($event: IClip) {
    this.clips.forEach((clip, index) => {
      if (clip.docId == $event.docId) {
        this.clips[index].title = $event.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.clipService.removeClip(clip);

    this.clips.forEach((element, index) => {
      if (clip.docId === element.docId) {
        this.clips.splice(index, 1);
      }
    });
  }

  async copyToClipboard($event: MouseEvent, docId: string | undefined) {
    $event.preventDefault();
    if (!docId) {
      return;
    }
    const url = `${location.origin}/clip/${docId}`;
    await navigator.clipboard.writeText(url);

    alert('link copied');
  }
}
