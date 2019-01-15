import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {News} from './rest/news.model';
import {NewsService} from './rest/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  private newsArray: Array<News>;

  constructor(private newsService: NewsService) {
  }

  ngOnInit() {
    this.loadNews();
  }

  private loadNews() {
    // News from a week ago
    const lastWeek = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 8);
    this.newsService.getNewsPublishedAfter(lastWeek).subscribe(((data: Array<News>) => {
      this.setNewsObservable(data);
    }));
  }

  setNewsObservable(value: Array<News>) {
    this.newsArray = value;
  }
}
