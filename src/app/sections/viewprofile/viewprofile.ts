import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServiceUser } from '../../services/userservice';
import { ActivatedRoute, RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MemberActivity } from '../admin/dashboard/membermanagement/memberactivity/memberactivity';
import { MemberProfile } from '../admin/dashboard/membermanagement/memberprofile/memberprofile';

@Component({
  selector: 'viewprofile',
  imports: [MemberActivity, MemberProfile, DatePipe],
  templateUrl: './viewprofile.html',
  styleUrl: './viewprofile.css',
})
export class ViewProfile implements OnInit {
  userguid: string = '';
  userid: number = 0;
  canUpdate: boolean = false;
  getUserProfile: any = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const userguid = params.get('userguid');
      const userid = params.get('userid');

      if (!userguid || !userid) {
        return;
      }

      this.userguid = userguid;
      this.userid = +userid;

      const loggedInUserGuid = this.authService.getUserGuid();

      this.canUpdate =
        !!loggedInUserGuid && userguid.toLowerCase() === loggedInUserGuid.toLowerCase();

      this.apiServiceUser.getUserProfileStatistics(this.userguid, this.userid, 200).subscribe({
        next: (data) => {
          this.getUserProfile = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('One or more requests failed:', err);
        },
      });
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
