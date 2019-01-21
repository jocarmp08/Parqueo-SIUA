import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss']
})
export class DatePickerDialogComponent implements OnInit {

  form: FormGroup;
  selectedDate: string;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<DatePickerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  accept() {
    /*
    if (this.form.value.time && this.form.value.date) {
      // Separate time (hours : minutes)
      const formattedTime = this.form.value.time.split(':');
      // Get UTC date
      let utcDate = new Date(this.form.value.date.getTime() - (1000 * 60 * 60 * 6));
      // Add hours
      utcDate = new Date(utcDate.getTime() + (1000 * 60 * 60 * parseInt(formattedTime[0], 10)));
      // Add minutes
      utcDate = new Date(utcDate.getTime() + (1000 * 60 * parseInt(formattedTime[1], 10)));
      // Add original 6 hours
      utcDate = new Date(utcDate.getTime() + (1000 * 60 * 60 * 6));
      // Return date
      this.dialogRef.close(utcDate);
    } else {
      this.cancel();
    }
    */
    this.dialogRef.close(this.selectedDate);
  }

  cancel() {
    this.dialogRef.close();
  }

}
