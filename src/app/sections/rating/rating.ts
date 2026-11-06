import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rating',
  standalone: true,
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() ratingCount: number = 0;
  @Input() userRating: number | null = null;
  @Input() success: boolean = false;

  @Output() ratingSelected = new EventEmitter<number>();

  selectRating(value: number): void {
    this.ratingSelected.emit(value);
  }
}
