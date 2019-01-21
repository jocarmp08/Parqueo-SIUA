import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NewsService} from '../../services/news.service';
import {NewsModel} from '../../models/news.model';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {SharedService} from '../../shared/shared.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  // Username
  private username: string;
  // News Array
  private newsArray: Array<NewsModel>;
  // News form
  private newsForm;
  // Flags
  private maxDescriptionLength = 280;
  private editionMode = false;
  private newsInEdition: NewsModel;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private newsService: NewsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
    this.buildForm();
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    this.newsArray = this.route.snapshot.data['observable'].reverse();
  }

  private buildForm() {
    this.newsForm = this.formBuilder.group({
      title: [null, Validators.required],
      schedulePublication: [false],
      publicationDate: [null, Validators.required],
      description: [null, Validators.compose([Validators.required, Validators.maxLength(280)])],
    });

    this.newsForm.get('publicationDate').disable();

    this.newsForm.get('schedulePublication').valueChanges
      .subscribe(value => {
        if (value) {
          this.newsForm.get('publicationDate').enable();
        } else {
          this.newsForm.get('publicationDate').reset();
          this.newsForm.get('publicationDate').disable();
        }
      });
  }

  private postNews() {
    // Set publication date
    let publicationDate: Date;
    let notify = false;
    if (this.newsForm.get('schedulePublication').value) {
      publicationDate = this.newsForm.get('publicationDate').value;
    } else {
      publicationDate = new Date(new Date().getTime());
      notify = true;
    }

    const news = this.prepareNewsModelFromForm(publicationDate);

    // Call REST API
    this.newsService.postNews(news).subscribe((data: NewsModel) => {
      // Show output message
      this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
      // Update news array
      this.newsArray.unshift(data);
      // Reset form
      this.newsForm.reset();
      // Notify
      if (notify) {
        this.sendNotification(news.title);
      }
    }, (error) => {
      console.log(error);
    });
  }

  private updateNews(newsToUpdate: NewsModel) {
    // Set publication date
    const publicationDate: Date = this.newsForm.get('publicationDate').value;

    // Ask for confirmation
    this.showDialogConfirmation('update').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID and prepare model
        const id = newsToUpdate.id;
        const news = this.prepareNewsModelFromForm(publicationDate);

        // Call REST API
        this.newsService.putNewsWithId(id, news).subscribe((data: NewsModel) => {
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

  private deleteNews(newsToDelete: NewsModel) {
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

  private sendNotification(title: string) {
    this.sharedService.publishNotification('news', title).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

  setNewsEditionModeOn(newsToModify: NewsModel) {
    this.editionMode = true;
    this.newsInEdition = newsToModify;
    // Set title
    this.newsForm.controls['title'].setValue(newsToModify.title);
    // Set description
    this.newsForm.controls['description'].setValue(newsToModify.description);
    // Set publication date
    this.newsForm.controls['publicationDate'].setValue(newsToModify.publicationDate);
    this.newsForm.controls['schedulePublication'].setValue(true);
  }

  setNewsEditionModeOff() {
    this.editionMode = false;
    this.newsForm.reset();
    this.newsInEdition = null;
  }

  private prepareNewsModelFromForm(publicationDate: Date) {
    const values = Object.assign({}, this.newsForm.value);
    return {
      title: values.title,
      description: values.description,
      creationDate: new Date(new Date().getTime()),
      publicationDate: publicationDate,
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
        this.newsForm.controls['publicationDate'].setValue(data);
      }
    });
  }

  private logout() {
    this.sharedService.logout();
  }

  private changePassword() {
    this.sharedService.changePassword();
  }
}
