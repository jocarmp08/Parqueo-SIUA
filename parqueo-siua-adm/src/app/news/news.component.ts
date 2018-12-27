import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NewsService} from './rest/news.service';
import {News} from './rest/news.model';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {Observable} from 'rxjs';
import {DialogData} from '../confirmation-dialog/dialog-data.inteface';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  // News Array
  private newsArray: Array<News>;
  // News form
  private createNewsForm = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(280)]]
  });
  // Flags
  private maxDescriptionLength = 280;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public snackBar: MatSnackBar, private newsService: NewsService) {
  }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    // News from a week ago
    const lastWeek = new Date(new Date().getTime() - (1000 * 60 * 60 * 24) * 8);
    this.newsService.getNewsPublishedAfter(lastWeek).subscribe(((data: Array<News>) => {
      this.setNewsArray(data.reverse());
    }));
  }

  postNews() {
    if (this.createNewsForm.valid) {
      // Prepare model
      const news = this.prepareNewsModelFromForm();

      // Call REST API
      this.newsService.postNews(news).subscribe((data: News) => {
        // Show output message
        this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
        // Update news array
        this.newsArray.unshift(data);
      }, (error) => {
        console.log(error);
      });
    }
  }

  updateNews(newsToUpdate: News) {
    if (this.createNewsForm.valid) {
      // Get ID and prepare model
      const id = newsToUpdate.id;
      const news = this.prepareNewsModelFromForm();

      // Call REST API
      this.newsService.putNewsWithId(id, news).subscribe((data) => {
        console.log(data);
      }, (error) => {
        console.log(error);
      });
    }
  }

  deleteNews(newsToDelete: News) {
    // Ask for confirmation
    this.showDialogConfirmation('delete').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID
        const id = newsToDelete.id;
        // Call REST API
        this.newsService.deleteNews(id).subscribe((data) => {
          // Show output message
          this.showOutputMessage(newsToDelete.title + ' se ha eliminado correctamente', 'Aceptar');
          // Update news array
          this.newsArray.splice(this.newsArray.indexOf(newsToDelete), 1);
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  private prepareNewsModelFromForm() {
    const values = Object.assign({}, this.createNewsForm.value);
    const news = {
      title: values.title,
      description: values.description,
      creationDate: new Date(new Date().getTime()),
      creator: 'ADMIN'
    };
    return news;
  }

  private showDialogConfirmation(event: string): Observable<boolean> {
    // Prepare messages
    let title: string;
    let message: string;
    if (event === 'update') {
      title = 'Confirmar modificación';
      message = '¿Modificar esta noticia?';
    } else if (event === 'delete') {
      title = 'Confirmar eliminación';
      message = '¿Eliminar esta noticia?';
    }

    // Prepare dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message
    };

    // Show and wait
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig).afterClosed();
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private setNewsArray(value: Array<News>) {
    this.newsArray = value;
  }

}
