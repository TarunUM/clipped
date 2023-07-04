import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IClip from '../models/iclip.model';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<IClip | null> {
  public clipCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingReq = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipCollection = db.collection('clips');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipCollection
      .doc(route.params['id'])
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();

          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      );
  }

  // instead of await async function we are returning promise
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipCollection.add(data);
  }

  getClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;

        if (!user) return of([]);

        const query = this.clipCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timeStamp', sort === '1' ? 'desc' : 'asc');
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipCollection.doc(id).update({
      title,
    });
  }

  async removeClip(clip: IClip) {
    const clipRef = this.storage.ref(`clipped/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );
    console.log(clip.screenshotFileName);

    await clipRef.delete();
    await screenshotRef.delete();

    await this.clipCollection.doc(clip.docId).delete();
  }

  async getAllClips() {
    if (this.pendingReq) {
      return;
    }
    this.pendingReq = true;
    let query = this.clipCollection.ref.orderBy('timeStamp', 'desc').limit(5);

    const { length } = this.pageClips;

    if (length) {
      const lastDocId = this.pageClips[length - 1].docId;
      const lastDoc = await this.clipCollection
        .doc(lastDocId)
        .get()
        .toPromise();

      query = query.startAfter(lastDoc);
    }
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      this.pageClips.push({
        docId: doc.id,
        ...doc.data(),
      });
    });

    this.pendingReq = false;
  }
}
