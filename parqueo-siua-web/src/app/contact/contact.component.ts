import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Entrance} from '../stats/rest/entrance.model';
import {ContactService} from './rest/contact.service';
import {Report} from './rest/report.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm = this.formBuilder.group({
    email: [null, Validators.required],
    subject: [null, Validators.required],
    type: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(1000)]]
  });

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<ContactComponent>, private contactService: ContactService) {
  }

  ngOnInit() {
  }

  sendReport() {
    if (this.contactForm.valid) {
      // Prepare model
      const values = Object.assign({}, this.contactForm.value);
      const report = {
        email: values.email,
        subject: values.subject,
        type: parseInt(values.type, 10),
        description: values.description,
        creationDate: new Date(new Date().getTime())
      };

      this.contactService.postReport(report).subscribe((data) => {
        console.log(data);
        this.closeDialog();
      }, (error) => {
        console.log(error);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
