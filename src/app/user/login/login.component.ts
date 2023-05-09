import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  submission = false;

  credentials = {
    email: '',
    password: '',
  };

  constructor(private auth: AngularFireAuth) {}

  showAlert = false;
  alertMsg = 'Please wait...';
  alertColor = 'blue';

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait Your account is being created.';
    this.alertColor = 'blue';
    this.submission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email as string,
        this.credentials.password as string
      );
    } catch (error) {
      this.alertMsg = 'Invalid Users Credentials.';
      this.alertColor = 'red';
      this.submission = false;
      return
    }
    this.alertMsg = 'User logged in successfully .';
    this.alertColor = 'green';
    this.submission = false;
  }
}
