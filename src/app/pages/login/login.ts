import { Component } from '@angular/core';
import { Login } from '../../sections/login/login';

@Component({
  selector: 'loginpage',
  imports: [Login],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {}
