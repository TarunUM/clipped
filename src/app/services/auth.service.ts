import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from "../models/user.model";
import {Observable} from "rxjs";
import {delay, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$ : Observable<boolean>;
  public isAuthenticateddelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );
    this.isAuthenticateddelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error("Password must be provided");
    }
    const userCreds = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );
    if(!userCreds.user?.uid){
      throw new Error("User Not Found");
    }
    await this.usersCollection.doc(userCreds.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCreds.user.updateProfile({
      displayName: userData.name,
    })
  }
}
