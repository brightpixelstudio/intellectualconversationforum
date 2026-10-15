import { Component } from '@angular/core';
import { Post } from '../../sections/post/post';

@Component({
  selector: 'postpage',
  imports: [Post],
  templateUrl: './postpage.html',
  styleUrl: './postpage.css',
})
export class PostPage {}
