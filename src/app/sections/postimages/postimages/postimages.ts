import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PostImage } from '../../../models/posts/postimage';

@Component({
  selector: 'postimages',
  standalone: true,
  imports: [],
  templateUrl: './postimages.html',
  styleUrl: './postimages.css',
})
export class PostImagesComponent {
  @Input() postimages: PostImage[] = [];
  @Input() editMode: boolean = false;

  @Output() removeImage = new EventEmitter<PostImage>();

  selectedPostImage: string | null = null;

  openPostImage(imageUrl: string | null): void {
    if (!imageUrl) return;

    this.selectedPostImage = imageUrl;
  }

  onRemoveImage(image: PostImage): void {
    this.removeImage.emit(image);
  }
}
