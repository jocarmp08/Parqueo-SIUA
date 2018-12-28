import {Component, OnInit} from '@angular/core';
import {News} from '../news/rest/news.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {SharedService} from '../shared/shared.service';
import {EventsService} from './rest/events.service';
import {Event} from './rest/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  // Events Array
  private eventsArray: Array<Event>;
  // Event form
  private createEventForm = this.formBuilder.group({
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
    this.eventsArray = this.route.snapshot.data['observable'].reverse();
  }

  private postEvent() {
    if (this.createEventForm.valid && this.startDate && this.endDate) {
      // Prepare model
      const event = this.prepareEventModelFromForm();

      // Call REST API
      this.eventsService.postEvent(event).subscribe((data: News) => {
        // Show output message
        this.showOutputMessage(data.title + ' se ha publicado correctamente', 'Aceptar');
        // Update news array
        this.eventsArray.unshift(data);
        // Reset form
        this.createEventForm.reset();
      }, (error) => {
        console.log(error);
      });
    }
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
    const values = Object.assign({}, this.createEventForm.value);
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
