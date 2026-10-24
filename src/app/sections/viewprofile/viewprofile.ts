import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUser } from '../../services/userservice';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'viewprofile',
  imports: [],
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
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
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

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }
}
