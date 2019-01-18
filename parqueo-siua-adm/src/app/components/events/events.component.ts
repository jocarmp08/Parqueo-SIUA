import {Component, OnInit} from '@angular/core';
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
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  // Events Array
  private eventsArray: Array<EventModel>;

  // Event form
  private eventForm;

  // System flags
  private maxDescriptionLength = 280;
  private editionMode = false;
  private eventInEdition: EventModel;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private eventsService: EventsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
    this.buildForm();
  }

  ngOnInit() {
    this.eventsArray = this.route.snapshot.data['observable'];
  }

  private buildForm() {
    this.eventForm = this.formBuilder.group({
      title: [null, Validators.required],
      schedulePublication: [false],
      publicationDate: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [null, Validators.compose([Validators.required, Validators.maxLength(280)])],
    });

    this.eventForm.get('publicationDate').disable();

    this.eventForm.get('schedulePublication').valueChanges
      .subscribe(value => {
        if (value) {
          this.eventForm.get('publicationDate').enable();
        } else {
          this.eventForm.get('publicationDate').reset();
          this.eventForm.get('publicationDate').disable();
        }
      });
  }

  private postEvent() {
    const startDate = this.eventForm.get('startDate').value;
    const endDate = this.eventForm.get('endDate').value;
    if (!this.validateStartAndEndDates(startDate, endDate)) {
      return;
    }

    // Set publication date
    let publicationDate: Date;
    let notify = false;
    if (this.eventForm.get('schedulePublication').value) {
      publicationDate = this.eventForm.get('publicationDate').value;
    } else {
      publicationDate = new Date(new Date().getTime());
      notify = true;
    }

    // Prepare model to post
    const event = this.prepareEventModelFromForm(publicationDate);

    // Call REST API
    this.eventsService.postEvent(event).subscribe((data: EventModel) => {
      // Show output message
      this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
      // Update news array
      this.eventsArray.push(data);
      this.eventsArray = this.eventsArray.sort((obj1, obj2) => {
        return +new Date(obj1.startDate) - +new Date(obj2.startDate); // Particularity of Typescript: operator + coerce to number
      });
      // Reset form
      this.eventForm.reset();
      // Notify to users
      if (notify) {
        this.sendNotification(event.title);
      }
    }, (error) => {
      console.log(error);
    });
  }

  private updateEvent(eventToUpdate: EventModel) {
    const startDate = this.eventForm.get('startDate').value;
    const endDate = this.eventForm.get('endDate').value;
    if (!this.validateStartAndEndDates(startDate, endDate)) {
      return;
    }

    // Set publication date
    const publicationDate: Date = this.eventForm.get('publicationDate').value;

    // Ask for confirmation
    this.showDialogConfirmation('update').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID and prepare model
        const id = eventToUpdate.id;
        const event = this.prepareEventModelFromForm(publicationDate);

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

  private deleteEvent(eventToUpdate: EventModel) {
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

  private validateStartAndEndDates(startDate: Date, endDate: Date) {
    // Start date greater than end date
    if (new Date(startDate) < new Date(endDate)) {
      return true;
    }
    this.showOutputMessage('Fechas de inicio y fin incorrectas', 'Aceptar');
    return false;
  }

  private sendNotification(title: string) {
    this.sharedService.publishNotification('event', title).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

  setEventEditionModeOn(eventToModify: EventModel) {
    this.editionMode = true;
    this.eventInEdition = eventToModify;
    this.eventForm.controls['title'].setValue(eventToModify.title);
    this.eventForm.controls['description'].setValue(eventToModify.description);
    this.eventForm.controls['startDate'].setValue(eventToModify.startDate);
    this.eventForm.controls['endDate'].setValue(eventToModify.endDate);
    // Set publication date
    this.eventForm.controls['publicationDate'].setValue(eventToModify.publicationDate);
    this.eventForm.controls['schedulePublication'].setValue(true);
  }

  setEventEditionModeOff() {
    this.editionMode = false;
    this.eventForm.reset();
    this.eventInEdition = null;
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
          this.eventForm.controls['startDate'].setValue(data);
        } else if (field === 'end') {
          this.eventForm.controls['endDate'].setValue(data);
        } else if (field === 'pub') {
          this.eventForm.controls['publicationDate'].setValue(data);
        }
      }
    });
  }

  private prepareEventModelFromForm(publicationDate: Date) {
    const values = Object.assign({}, this.eventForm.value);
    return {
      title: values.title,
      creationDate: new Date(new Date().getTime()),
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      publicationDate: publicationDate,
      creator: localStorage.getItem('email'),
    };
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
