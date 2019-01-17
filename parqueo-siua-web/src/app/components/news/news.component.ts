import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {NewsModel} from '../../models/news.model';
import {NewsService} from '../../services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  // Array of News
  private newsArray: Array<NewsModel>;
  // Http error
  private httpError;

  constructor(private newsService: NewsService) {
  }

  ngOnInit() {
    this.loadNews();
  }

  private loadNews() {
    // NewsModel from a week ago
    this.httpError = null;
    const now: Date = new Date(new Date().getTime());
    const lastWeek: Date = new Date(now.getTime() - (1000 * 60 * 60 * 24) * 7);
    this.newsService.getNewsPublishedFromAndTo(lastWeek, now).subscribe((data: Array<NewsModel>) => {
      this.newsArray = this.sortArrayByDateDesc(data);
    }, error => {
      this.httpError = error;
    });
  }

  private sortArrayByDateDesc(array: Array<NewsModel>): Array<NewsModel> {
    return array.sort((news1, news2) => {
      // Particularity of Typescript: operator + coerce to number
      return +new Date(news2.publicationDate) - +new Date(news1.publicationDate);
    });
  }
}
