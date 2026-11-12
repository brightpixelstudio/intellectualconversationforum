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
}
