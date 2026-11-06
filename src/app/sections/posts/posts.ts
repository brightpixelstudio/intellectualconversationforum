import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { ApiServiceUtility } from '../../services/utilityservice';
import { ApiServicePost } from '../../services/postservice';
import { AuthService } from '../../services/auth';
import { GetPostsByCategoryUserRating } from '../../models/posts/getpostsbycategoryuserrating';
import { getusersettingscatagories } from '../../models/membersettings/getusersettingscatagories';
import { getusersettingsuser } from '../../models/membersettings/getusersettingsuser';
import { PostComponent } from './post/post/post';

@Component({
  selector: 'posts',
  imports: [PostComponent],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  activeTab = 0;
  noPosts: boolean = false;
  errormsg: string = '';
  userguid: string | null = null;
  userguidloggedin: string | null = null;
  rating: number = 0;
  catagoryid: number | null = null;
  searchString: string = '';
  userList!: any[];
  catagoryList!: any[];
  postsList: GetPostsByCategoryUserRating[] = [];
  userSettingsCatagories: getusersettingscatagories[] = [];
  userSettingsUser: getusersettingsuser[] = [];
  userSettingsCatagoriesMyFeed: getusersettingscatagories[] = [];
  userSettingsUserMyFeed: getusersettingsuser[] = [];
  getUserSettings: any[] = [];

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServiceUserSettings: ApiServiceUserSettings,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServicePost: ApiServicePost,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userguidloggedin = this.authService.getUserGuid() ?? '';

    forkJoin({
      users: this.apiServiceUser.getUserList(),
      catagories: this.apiServiceUtilities.getCatagoryList(),
      userSettings: this.apiServiceUserSettings.getUserSettingsCached(this.userguidloggedin),
      userSettingsMyFeed: this.apiServiceUserSettings.getUserSettingsMyFeedCached(
        this.userguidloggedin,
      ),
    }).subscribe({
      next: (data) => {
        this.userList = data.users;
        this.catagoryList = data.catagories;

        this.getUserSettings = data.userSettings.getUserSettings;
        this.userSettingsCatagories = data.userSettings.getUserSettingsCatagories;
        this.userSettingsUser = data.userSettings.getUserSettingsUser;
        this.userSettingsCatagoriesMyFeed = data.userSettingsMyFeed.getUserSettingsCatagories;
        this.userSettingsUserMyFeed = data.userSettingsMyFeed.getUserSettingsUser;

        this.cdr.detectChanges();

        // Any query strings sent in?
        const urlParams = new URLSearchParams(window.location.search);
        const catagory = urlParams.get('catagoryid');
        const user = urlParams.get('userguid');
        if (catagory) {
          this.catagoryid = +catagory;
        }
        if (user) {
          this.userguid = user;
        }

        // Load posts based on parameters or default to My Feed
        if (catagory || user) {
          this.activeTab = 1;
          this.loadPosts();
        } else {
          this.loadMyFeedPosts();
        }
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  selectTab(tab: number, event: Event): void {
    event.preventDefault();
    this.activeTab = tab;
    this.clearPosts();
  }

  clearPosts(): void {
    this.noPosts = false;
    this.postsList = [];
  }

  loadMyFeedPosts() {
    // If no catagories or users are selected, show error message and return
    if (
      this.userSettingsCatagoriesMyFeed.length === 0 ||
      this.userSettingsUserMyFeed.length === 0
    ) {
      this.noPosts = true;
      this.errormsg =
        "Your feed is ready! You haven't selected any categories or members yet. Visit My Settings to customize the posts you'd like to see.";
      this.cdr.detectChanges();
      return;
    }

    // get posts
    this.apiServicePost.getPostsMyFeed(this.userguidloggedin).subscribe({
      next: (data: GetPostsByCategoryUserRating[]) => {
        this.postsList = data;
        this.noPosts = false;
        // Reset post rating success messages
        this.postsList.forEach((post) => {
          post.successrating = false;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.noPosts = true;
        this.errormsg = 'There are no posts based on your selections.';
        this.cdr.detectChanges();
      },
    });
  }

  loadPosts() {
    // get posts
    this.apiServicePost
      .getPosts(
        this.catagoryid,
        this.userguid,
        this.rating,
        this.searchString,
        this.userguidloggedin,
      )
      .subscribe({
        next: (data: GetPostsByCategoryUserRating[]) => {
          this.postsList = data;
          this.noPosts = false;
          // Reset post rating success messages
          this.postsList.forEach((post) => {
            post.successrating = false;
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.noPosts = true;
          this.errormsg = 'There are no posts based on your selections.';
          this.cdr.detectChanges();
        },
      });
  }

  // Events
  // **************************
  // Main Filters
  onCatagoryChange(catagory: string) {
    this.catagoryid = +catagory;
  }

  onUserChange(user: string) {
    this.userguid = user;
  }

  onPostRatingChange(input: HTMLInputElement) {
    const rating = input.value === '' ? 0 : Number(input.value);
    if (rating !== 0 && (rating < 1 || rating > 10)) {
      input.value = '';
      return;
    }

    this.rating = rating;
  }

  onSearchChange(value: string): void {
    this.searchString = value;
  }

  // **************************

  // comes from child delte post event
  onPostDeleted(postguid: string): void {
    this.postsList = this.postsList.filter((post) => post.postguid !== postguid);

    this.cdr.detectChanges();
  }
}
