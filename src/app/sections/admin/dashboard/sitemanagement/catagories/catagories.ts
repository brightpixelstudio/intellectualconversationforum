import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUtility } from '../../../../../services/utilityservice';
import { DatePipe } from '@angular/common';
import { GetCatagoryList } from '../../../../../models/utilities/getcatagorylist';

@Component({
  selector: 'catagories',
  imports: [DatePipe],
  templateUrl: './catagories.html',
  styleUrl: './catagories.css',
})
export class Catagories implements OnInit {
  getCatagories: GetCatagoryList[] = [];

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
