import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ApiServiceUser } from './../../../../../../../services/userservice';
import { GetAccountStatuses } from '../../../../../../../models/member/getaccountstatuses';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'memberupdate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './memberupdate.html',
  styleUrl: './memberupdate.css',
})
export class MemberUpdate implements OnInit {
  @Output() memberSelected = new EventEmitter<number>();

  accountStatuses: GetAccountStatuses[] = [];
  accountStatusId = 1;

  constructor(private apiServiceUser: ApiServiceUser) {}

  ngOnInit(): void {
    this.apiServiceUser.getAccountStatuses().subscribe({
      next: (data) => {
        this.accountStatuses = data;
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
      },
    });
  }

  selectStatus(accountStatusId: number): void {
    this.accountStatusId = accountStatusId;
    this.memberSelected.emit(accountStatusId);
  }
}
