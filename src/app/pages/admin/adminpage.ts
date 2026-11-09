import { Component } from '@angular/core';
import { Dashboard } from '../../sections/admin/dashboard/dashboard';

@Component({
  selector: 'adminpage',
  imports: [Dashboard],
  templateUrl: './adminpage.html',
  styleUrl: './adminpage.css',
})
export class AdminPage {}
