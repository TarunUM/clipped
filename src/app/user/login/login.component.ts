import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  }

  showAlert = false;
  alertMsg = 'Please wait...';
  alertColor = 'blue';

  login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait Your account is being created.';
    this.alertColor = 'blue';
    console.log(this.credentials);
    setTimeout(() => {
      this.showAlert = false;
      this.alertMsg = '';
      this.alertColor = '';
      this.credentials = {
        email: '',
        password: ''
      }
    }, 2000)
  }
}
