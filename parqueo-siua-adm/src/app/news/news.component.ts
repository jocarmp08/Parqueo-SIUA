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
  private newsCreateForm = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(280)]]
  });
  // Flags
  private maxDescriptionLength = 280;
  private editionMode = false;
  private newsInEdition: News;
  private publicationDate: Date;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private newsService: NewsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.newsArray = this.route.snapshot.data['observable'].reverse();
  }

  postNews() {
    if (this.newsCreateForm.valid && this.publicationDate) {
      // Date of publication less than the current date
      if (new Date(new Date().getTime()) > new Date(this.publicationDate)) {
        this.showOutputMessage('Fecha de publicación incorrecta', 'Aceptar');
      } // All is correct
      else {
        // Prepare model
        const news = this.prepareNewsModelFromForm();

        // Call REST API
        this.newsService.postNews(news).subscribe((data: News) => {
          // Show output message
          this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
          // Update news array
          this.newsArray.unshift(data);
          // Reset form
          this.newsCreateForm.reset();
          this.publicationDate = null;
        }, (error) => {
          console.log(error);
        });
      }
    }
  }

  updateNews(newsToUpdate: News) {
    if (this.newsCreateForm.valid) {
      // Date of publication less than the current date
      if (new Date(new Date().getTime()) > new Date(this.publicationDate)) {
        this.showOutputMessage('Fecha de publicación incorrecta', 'Aceptar');
      } // All is correct
      else {
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
    this.newsCreateForm.controls['title'].setValue(newsToModify.title);
    this.newsCreateForm.controls['description'].setValue(newsToModify.description);
    this.publicationDate = newsToModify.publicationDate;
  }

  setNewsEditionModeOff() {
    this.editionMode = false;
    this.newsCreateForm.reset();
    this.publicationDate = null;
  }

  private prepareNewsModelFromForm() {
    const values = Object.assign({}, this.newsCreateForm.value);
    return {
      title: values.title,
      description: values.description,
      creationDate: new Date(new Date().getTime()),
      publicationDate: this.publicationDate,
      creator: localStorage.getItem('email'),
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

  showDatePicker() {
    this.sharedService.showDatePickerDialog().subscribe((data) => {
      if (data) {
        this.publicationDate = data;
      }
    });
  }

}
