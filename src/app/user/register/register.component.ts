import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}

  submission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(4)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
    Validators.maxLength(14),
  ]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  showAlert = false;
  alertMsg = 'Please wait...';
  alertColor = 'blue';

  async register() {
    this.submission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait Your account is being created.';
    this.alertColor = 'blue';

    const { email, password } = this.registerForm.value;
    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (err) {
      console.log(err);

      this.alertMsg = 'Error creating user with these email and password';
      this.alertColor = 'red';
      this.submission = false;
      return;
    }
    this.alertMsg = 'Account Created successfully';
    this.alertColor = 'green';
    this.submission = false;
  }
}
