import { Component, Input } from '@angular/core';
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

  selectedPostImage: string | null = null;

  openPostImage(imageUrl: string | null): void {
    if (!imageUrl) return;

    this.selectedPostImage = imageUrl;
  }
}
