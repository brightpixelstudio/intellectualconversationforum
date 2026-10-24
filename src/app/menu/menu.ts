import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth';

interface MenuItem {
  label: string;
  link: string;
}

@Component({
  selector: 'menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent {
  menuItems: MenuItem[] = [
    { label: 'Login', link: '/' },
    { label: 'Registration', link: '/registration' },
    { label: 'Members', link: '/members' },
    { label: 'Statistics', link: '/statistics' },
    { label: 'Posts', link: '/posts' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  editprofile(): void {
    const userGuid = this.authService.getUserGuid();

    if (!userGuid) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/editprofile'], {
      queryParams: { userguid: userGuid },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
