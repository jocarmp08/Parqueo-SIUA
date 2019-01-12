import {Component, OnInit} from '@angular/core';
import {NewsService} from '../../services/news.service';
import {NewsModel} from '../../models/news.model';

@Component({
    selector: 'app-news',
    templateUrl: './news.page.html',
    styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

    private httpError;
    private newsArray: Array<NewsModel>;

    constructor(private newsService: NewsService) {
    }

    ngOnInit() {
        this.loadNews(null);
    }

    loadNews(refresher) {
        // NewsModel from a week ago
        this.httpError = null;
        const now: Date = new Date(new Date().getTime());
        const lastWeek: Date = new Date(now.getTime() - (1000 * 60 * 60 * 24) * 7);
        this.newsService.getNewsPublishedFromAndTo(lastWeek, now).subscribe((data: Array<NewsModel>) => {
            this.newsArray = this.sortArrayByDateDesc(data);
            if (refresher != null) {
                refresher.target.complete();
            }
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
