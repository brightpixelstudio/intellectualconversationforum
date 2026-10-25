import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServiceUser } from '../../services/userservice';
import { ActivatedRoute, RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'viewprofile',
  imports: [DatePipe],
  templateUrl: './viewprofile.html',
  styleUrl: './viewprofile.css',
})
export class ViewProfile implements OnInit {
  userguid: string = '';
  getUserProfile: any = '';

  // image
  profileImage: File | null = null;
  profileImagePreview: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // get the query string value
    const userguid = this.route.snapshot.queryParamMap.get('userguid');
    if (!userguid) {
      return;
    }
    this.userguid = userguid;

    // user forkjoin in service call
    this.apiServiceUser.getUserProfileStatistics(this.userguid).subscribe({
      next: (data) => {
        // Data maps exactly to the keys defined in forkJoin
        this.getUserProfile = data;
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
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
}
