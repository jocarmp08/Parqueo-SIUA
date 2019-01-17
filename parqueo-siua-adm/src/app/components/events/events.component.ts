import {Component, OnInit} from '@angular/core';
import {NewsModel} from '../../models/news.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {Observable} from 'rxjs';
import {SharedService} from '../../shared/shared.service';
import {EventModel} from '../../models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  // Events Array
  private eventsArray: Array<EventModel>;

  // Event form
  private eventCreateForm = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, Validators.compose([Validators.required, Validators.maxLength(280)])],
    publicationDateMode: [null, Validators.required]
  });

  // Dates (auxiliary validation and edition flags)
  private startDate: Date;
  private endDate: Date;
  private publicationDate: Date;

  // System flags
  private maxDescriptionLength = 280;
  private editionMode = false;
  private eventInEdition: NewsModel;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private eventsService: EventsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.eventsArray = this.route.snapshot.data['observable'];
  }

  postEvent() {
    if (this.eventCreateForm.valid && this.startDate && this.endDate) {
      // Validate dates
      if (!this.validateStartAndEndDates()) {
        return; // Incorrect start and end dates
      }

      // Publication date mode
      const publicationDateMode = Object.assign({}, this.eventCreateForm.value).publicationDateMode;
      if (publicationDateMode === '1') {
        this.publicationDate = new Date(new Date().getTime()); // Now
      } else {
        return;
      }

      // Prepare model to post
      const event = this.prepareEventModelFromForm();

      // Call REST API
      this.eventsService.postEvent(event).subscribe((data: EventModel) => {
        // Show output message
        this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');

        // Update news array
        this.eventsArray.push(data);
        this.eventsArray = this.eventsArray.sort((obj1, obj2) => {
          return +new Date(obj1.startDate) - +new Date(obj2.startDate); // Particularity of Typescript: operator + coerce to number
        });

        // Reset form and flags
        this.setEventEditionModeOff();

        // Notify to users
        this.sharedService.publishNotification('event', event.title).subscribe();
      }, (error) => {
        console.log(error);
      });
    }
  }

  updateEvent(eventToUpdate: EventModel) {
    // Validate dates
    if (!this.validateStartAndEndDates()) {
      return; // Incorrect start and end dates
    }

    // Ask for confirmation
    this.showDialogConfirmation('update').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID and prepare model
        const id = eventToUpdate.id;
        const event = this.prepareEventModelFromForm();

        // Call REST API
        this.eventsService.putEventWithId(id, event).subscribe((data: EventModel) => {
          // Show output message
          this.showOutputMessage(eventToUpdate.title + ' se ha modificado correctamente', 'Aceptar');

          // Update news array
          this.eventsArray[this.eventsArray.indexOf(eventToUpdate)] = data;
          this.eventsArray = this.eventsArray.sort((obj1, obj2) => {
            return +new Date(obj1.startDate) - +new Date(obj2.startDate); // Particularity of Typescript: operator + coerce to number
          });

          // Exit edition mode
          this.setEventEditionModeOff();
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  deleteEvent(eventToUpdate: EventModel) {
    // Ask for confirmation
    this.showDialogConfirmation('delete').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID
        const id = eventToUpdate.id;

        // Call REST API
        this.eventsService.deleteEvent(id).subscribe((data) => {
          // Show output message
          this.showOutputMessage(eventToUpdate.title + ' se ha eliminado correctamente', 'Aceptar');

          // Update news array
          this.eventsArray.splice(this.eventsArray.indexOf(eventToUpdate), 1);
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  private validateStartAndEndDates() {
    // Start date greater than end date
    if (new Date(this.startDate) < new Date(this.endDate)) {
      return true;
    }
    this.showOutputMessage('Fecha de inicio y fin incorrectas', 'Aceptar');
    return false;
  }

  setEventEditionModeOn(eventToModify: EventModel) {
    this.editionMode = true;
    this.eventInEdition = eventToModify;
    this.eventCreateForm.controls['title'].setValue(eventToModify.title);
    this.eventCreateForm.controls['description'].setValue(eventToModify.description);
    this.startDate = eventToModify.startDate;
    this.endDate = eventToModify.endDate;
  }

  setEventEditionModeOff() {
    this.editionMode = false;
    this.eventCreateForm.reset();
    this.startDate = null;
    this.endDate = null;
    this.publicationDate = null;
  }

  private showDialogConfirmation(event: string): Observable<boolean> {
    // Prepare messages
    let title: string;
    let message: string;
    if (event === 'update') {
      title = 'Confirmar modificación';
      message = '¿Modificar este evento?';
    } else if (event === 'delete') {
      title = 'Confirmar eliminación';
      message = '¿Eliminar este evento?';
    }

    return this.sharedService.showConfirmationDialog(title, message);
  }

  showDatePicker(field: string) {
    this.sharedService.showDatePickerDialog().subscribe((data) => {
      if (data) {
        if (field === 'start') {
          this.startDate = data;
        } else if (field === 'end') {
          this.endDate = data;
        } else if (field === 'pub') {
          this.publicationDate = data;
        }
      }
    });
  }

  private prepareEventModelFromForm() {
    const values = Object.assign({}, this.eventCreateForm.value);
    return {
      title: values.title,
      creationDate: new Date(new Date().getTime()),
      description: values.description,
      startDate: this.startDate,
      endDate: this.endDate,
      publicationDate: this.publicationDate,
      creator: localStorage.getItem('email'),
    };
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
