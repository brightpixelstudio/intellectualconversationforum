import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceStatistics } from '../../services/statisticservice';
import { GetAllProfileMembers } from '../../models/getallprofilemembers';
import { GetNewestMembers } from '../../models/getnewestmembers';
import { GetMostPostsMembers } from '../../models/getmostpostsmembers';
import { GetLatestLoginsMembers } from '../../models/getlatestloginsmembers';
import { MemberReportType } from '../../enums/memberreportype';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPencil, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'members',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members implements OnInit {
  memberListGetAllProfile: GetAllProfileMembers[] = [];
  memberListGetNewestMembers: GetNewestMembers[] = [];
  memberListMostPostsMembers: GetMostPostsMembers[] = [];
  memberListLatestLoginsMembers: GetLatestLoginsMembers[] = [];
  protected MemberReportType = MemberReportType;
  reportType = MemberReportType.All;
  userguid: string = '';
  faTrash = faTrash;
  faPencil = faPencil;
  faMagnifyingGlassChart = faMagnifyingGlassChart;

  constructor(
    private apiService: ApiServiceUser,
    private apiServiceStatistics: ApiServiceStatistics,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.onMemberTypeChange('all');
    this.userguid = this.authService.getUserGuid() ?? '';
  }

  onMemberTypeChange(value: string) {
    // Load the correct data
    switch (value) {
      case 'all':
        this.reportType = MemberReportType.All;
        this.apiService.getAllProfileMembers().subscribe((data: GetAllProfileMembers[]) => {
          this.memberListGetAllProfile = data;
          this.cdr.detectChanges();
        });
        break;

      case 'newest':
        this.reportType = MemberReportType.Newest;
        this.apiService.getNewestMembers().subscribe((data: GetNewestMembers[]) => {
          this.memberListGetNewestMembers = data;
          this.cdr.detectChanges();
        });
        break;

      case 'mostposts':
        this.reportType = MemberReportType.MostPosts;
        this.apiServiceStatistics.getMostPostsMembers().subscribe((data: GetMostPostsMembers[]) => {
          this.memberListMostPostsMembers = data;
          this.cdr.detectChanges();
        });
        break;

      case 'lastlogin':
        this.reportType = MemberReportType.LastLogin;
        this.apiService.getLatestLoginsMembers().subscribe((data: GetLatestLoginsMembers[]) => {
          this.memberListLatestLoginsMembers = data;
          this.cdr.detectChanges();
        });
        break;
    }
  }

  removeMember<T>(list: T[], condition: (item: T) => boolean): void {
    const index = list.findIndex(condition);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  onDeleteUser(guid: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this member?');
    if (confirmed) {
      this.apiService.deleteUser(guid).subscribe({
        next: (response) => {
          // remove the record from all lists (although they might be loaded yet) (no reason to reload)
          this.removeMember(this.memberListGetAllProfile, (user) => user.userguid === guid);
          this.removeMember(this.memberListGetNewestMembers, (user) => user.userguid === guid);
          this.removeMember(this.memberListMostPostsMembers, (user) => user.userguid === guid);
          this.removeMember(this.memberListLatestLoginsMembers, (user) => user.userguid === guid);
        },
        error: (error) => {
          window.alert('Error deleting the member');
        },
      });
    }
  }
}
