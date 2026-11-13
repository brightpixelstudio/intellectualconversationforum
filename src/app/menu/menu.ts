import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth';
import { ApiServiceUserSettings } from '../services/usersettingsservice';
import { NotificationsComponent } from '../sections/notifications/notifications';

interface MenuItem {
  label: string;
  link: string;
}

@Component({
  selector: 'menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, NotificationsComponent],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent {
  isAdmin = false;
  menuItems: MenuItem[] = [
    { label: 'Login', link: '/' },
    { label: 'Registration', link: '/registration' },
    { label: 'Members', link: '/members' },
    { label: 'Statistics', link: '/statistics' },
    { label: 'Posts', link: '/posts' },
    { label: 'Administration', link: '/admin' },
  ];

  constructor(
    public authService: AuthService,
    public apiServiceUserSettings: ApiServiceUserSettings,
    private router: Router,
  ) {}

  viewprofile(): void {
    const userGuid = this.authService.getUserGuid();

    if (!userGuid) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/viewprofile'], {
      queryParams: { userguid: userGuid },
    });
  }

  usersettings(): void {
    const userGuid = this.authService.getUserGuid();

    if (!userGuid) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/membersettings'], {
      queryParams: { userguid: userGuid },
    });
  }

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
    this.apiServiceUserSettings.clearUserSettingsCache();
    this.authService.logout();
  }
}
