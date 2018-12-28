import {Component, OnInit} from '@angular/core';
import {News} from '../news/rest/news.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {SharedService} from '../shared/shared.service';
import {EventsService} from './rest/events.service';
import {Event} from './rest/event.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  // Events Array
  private eventsArray: Array<Event>;
  // Event form
  private eventCreateForm = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(280)]],
  });
  // Dates
  private startDate: Date;
  private endDate: Date;
  // Flags
  private maxDescriptionLength = 280;
  private editionMode = false;
  private eventInEdition: News;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private eventsService: EventsService,
              private route: ActivatedRoute, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.eventsArray = this.route.snapshot.data['observable'];
  }

  postEvent() {
    if (this.eventCreateForm.valid && this.startDate && this.endDate) {
      // Prepare model
      const event = this.prepareEventModelFromForm();

      // Call REST API
      this.eventsService.postEvent(event).subscribe((data: Event) => {
        // Show output message
        this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
        // Update news array
        this.eventsArray.push(data);
        this.eventsArray = this.eventsArray.sort((obj1, obj2) => {
          return new Date(obj1.startDate) - new Date(obj2.startDate);
        });
        // Reset form and flags
        this.eventCreateForm.reset();
        this.startDate = null;
        this.endDate = null;
      }, (error) => {
        console.log(error);
      });
    }
  }

  updateEvent(eventToUpdate: Event) {
    if (this.eventCreateForm.valid) {
      // Ask for confirmation
      this.showDialogConfirmation('update').subscribe(result => {
        // User confirmed deletion
        if (result) {
          // Get ID and prepare model
          const id = eventToUpdate.id;
          const news = this.prepareEventModelFromForm();

          // Call REST API
          this.eventsService.putEventWithId(id, news).subscribe((data: Event) => {
            // Show output message
            this.showOutputMessage(eventToUpdate.title + ' se ha modificado correctamente', 'Aceptar');
            // Update news array
            this.eventsArray[this.eventsArray.indexOf(eventToUpdate)] = data;
            this.eventsArray = this.eventsArray.sort((obj1, obj2) => {
              return new Date(obj1.startDate) - new Date(obj2.startDate);
            });
            // Exit edition mode
            this.setEventEditionModeOff();
          }, (error) => {
            console.log(error);
          });
        }
      });
    }
  }

  deleteEvent(eventToUpdate: Event) {
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

  setEventEditionModeOn(eventToModify: Event) {
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
      creator: 'ADMIN'
    };
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
