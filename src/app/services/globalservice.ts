import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes it accessible globally
})
export class GlobalService {
  getTimePassed(postDate: Date): string {
    const currentDate: Date = new Date();
    const newPostDate: Date = new Date(postDate);

    const diffInSeconds = Math.abs(newPostDate.getTime() - currentDate.getTime()) / 1000;

    const days = Math.floor(diffInSeconds / (60 * 60 * 24));
    const hours = Math.floor((diffInSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((diffInSeconds / 60) % 60);

    let posted: string = `Posted `;
    if (days > 0) {
      posted += `${days} days, ${hours} hours, ${minutes} minutes ago`;
    } else if (hours > 0) {
      posted += `${hours} hours, ${minutes} minutes ago`;
    } else {
      posted += `${minutes} minutes ago`;
    }
    return posted;
  }

  checkQuillLength(maxLength: number, event: any): number {
    const quill = event.editor;
    let currentQuillLength: number = quill.getLength() - 1;

    if (currentQuillLength > maxLength) {
      // Revert/delete the characters that exceed the limit
      quill.deleteText(maxLength, quill.getLength());
      currentQuillLength = maxLength;
    }

    return currentQuillLength;
  }

  getQuillModuleToolbar(): any {
    return {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'], // remove formatting button
      ],
    };
  }
}
