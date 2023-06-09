import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from "@angular/fire/compat/firestore";
import IClip from "../models/iclip.model";

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  public clipCollection : AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore) {
    this.clipCollection = db.collection('clips');
  }

  async createClip(data: IClip){
    await this.clipCollection.add(data);
  }
}
