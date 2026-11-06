import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'rating',
  imports: [DecimalPipe],
  standalone: true,
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() ratingCount: number = 0;
  @Input() userRating: number | null = null;
  @Input() canRate: boolean = true;
  @Input() success: boolean = false;

  @Output() ratingSelected = new EventEmitter<number>();

  selectRating(value: number): void {
    this.ratingSelected.emit(value);
  }
}
