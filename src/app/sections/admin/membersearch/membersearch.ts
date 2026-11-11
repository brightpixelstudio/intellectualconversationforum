import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceAdmin } from '../../../services/adminservice';
import { MemberSearch } from '../../../models/admin/membersearch';

@Component({
  selector: 'membersearch',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './membersearch.html',
  styleUrl: './membersearch.css',
})
export class MemberSearchComponent {
  private apiServiceAdmin = inject(ApiServiceAdmin);
  private cdr = inject(ChangeDetectorRef);

  @Output() memberSelected = new EventEmitter<string>();

  searchText = '';
  members: MemberSearch[] = [];
  selectedUserGuid = '';
  loading = false;
  errorMessage = '';

  constructor() {}

  searchMembers(): void {
    const search = this.searchText.trim();

    if (search.length < 3) return;

    this.loading = true;
    this.errorMessage = '';
    this.members = [];
    this.selectedUserGuid = '';

    this.apiServiceAdmin.searchMembers(search).subscribe({
      next: (data) => {
        this.members = data;
        this.loading = false;
        this.cdr.detectChanges();

        if (data.length === 0) {
          this.errorMessage = 'No members found.';
        }
      },
      error: (err) => {
        console.error('Member search failed:', err);
        this.errorMessage = 'Unable to search members.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectMember(userguid: string): void {
    this.selectedUserGuid = userguid;
    this.memberSelected.emit(userguid);
  }
}
