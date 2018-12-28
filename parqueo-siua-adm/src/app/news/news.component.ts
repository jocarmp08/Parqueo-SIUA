import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NewsService} from './rest/news.service';
import {News} from './rest/news.model';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {SharedService} from '../shared/shared.service';
import {ActivatedRoute} from '@angular/router';

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
  private editionMode = false;
  private newsInEdition: News;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private newsService: NewsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.newsArray = this.route.snapshot.data['observable'].reverse();
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
        // Reset form
        this.createNewsForm.reset();
      }, (error) => {
        console.log(error);
      });
    }
  }

  updateNews(newsToUpdate: News) {
    if (this.createNewsForm.valid) {
      // Ask for confirmation
      this.showDialogConfirmation('update').subscribe(result => {
        // User confirmed deletion
        if (result) {
          // Get ID and prepare model
          const id = newsToUpdate.id;
          const news = this.prepareNewsModelFromForm();

          // Call REST API
          this.newsService.putNewsWithId(id, news).subscribe((data: News) => {
            // Show output message
            this.showOutputMessage(newsToUpdate.title + ' se ha modificado correctamente', 'Aceptar');
            // Update news array
            this.newsArray[this.newsArray.indexOf(newsToUpdate)] = data;
            // Exit edition mode
            this.setNewsEditionModeOff();
          }, (error) => {
            console.log(error);
          });
        }
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

  setNewsEditionModeOn(newsToModify: News) {
    this.editionMode = true;
    this.newsInEdition = newsToModify;
    this.createNewsForm.controls['title'].setValue(newsToModify.title);
    this.createNewsForm.controls['description'].setValue(newsToModify.description);
  }

  setNewsEditionModeOff() {
    this.editionMode = false;
    this.createNewsForm.reset();
  }

  private prepareNewsModelFromForm() {
    const values = Object.assign({}, this.createNewsForm.value);
    return {
      title: values.title,
      description: values.description,
      creationDate: new Date(new Date().getTime()),
      creator: 'ADMIN'
    };
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

    return this.sharedService.showConfirmationDialog(title, message);
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
