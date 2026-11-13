import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUtility } from '../../../../../services/utilityservice';
import { DatePipe } from '@angular/common';
import { GetCatagoryList } from '../../../../../models/utilities/getcatagorylist';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'catagories',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './catagories.html',
  styleUrl: './catagories.css',
})
export class Catagories implements OnInit {
  catagoryText = '';
  getCatagories: GetCatagoryList[] = [];
  showSuccess = false;
  showError = false;
  errorMsg = '';

  constructor(
    private apiService: ApiServiceUtility,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadcatagories();
  }

  private loadcatagories(): void {
    // get ALL Blog information
    this.apiService.getCatagoryList().subscribe({
      next: (data) => {
        this.getCatagories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }

  addCatagory() {
    this.showSuccess = false;
    this.showError = false;

    if (!this.catagoryText.trim() || this.catagoryText.trim().length < 3) {
      return;
    }

    if (this.checkDuplicateCategory()) {
      this.showError = true;
      this.errorMsg = 'This catagory is already in the list.';
      this.cdr.detectChanges();
      return;
    }

    console.log('Here');

    this.apiService.submitAddCatagory(this.catagoryText).subscribe({
      next: (data) => {
        this.showSuccess = true;
        this.loadcatagories();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showSuccess = false;
        this.showError = true;
        this.cdr.detectChanges();
        this.errorMsg = err;
      },
    });
  }

  // helpers
  checkDuplicateCategory(): boolean {
    const category = this.catagoryText.trim().toLowerCase();

    return this.getCatagories.some(
      (item: GetCatagoryList) => item.catagory.trim().toLowerCase() === category,
    );
  }
}
