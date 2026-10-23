import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  link: string;
}

@Component({
  selector: 'menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
}
