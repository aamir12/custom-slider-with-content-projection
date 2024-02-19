import { Component, OnInit } from '@angular/core';
import { docs, tags, videos } from './data';

@Component({
  selector: 'table-overview-example',
  styleUrls: ['table-overview-example.css'],
  templateUrl: 'table-overview-example.html',
})
export class TableOverviewExample implements OnInit {
  tags: string[] = [];

  videos: any[] = [];
  docs: any[] = [];

  d = {
    Title: 'Title4',
    Body: 'Body4',
    ImagePath: 'https://dummyimage.com/600x400/000/fff',
    docPath: 'https://dummyimage.com/600x400/000/fff',
    YoutubeUrl: 'https://www.youtube.com/watch?v=nS5qbSJLGx8',
  };

  list = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  openTutorialFn!: (data: string) => void;
  constructor() {
    this.openTutorialFn = this.openTutorial.bind(this);
  }
  selectedTab(e: string) {
    console.log(e);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.videos = videos;
      this.tags = tags;
      this.docs = docs;
    }, 2000);
  }

  openTutorial(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
