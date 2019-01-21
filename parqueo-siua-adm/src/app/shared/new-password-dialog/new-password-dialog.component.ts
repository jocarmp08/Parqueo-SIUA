import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../modify-counter-dialog/dialog-data.interface';

@Component({
  selector: 'app-new-password-dialog',
  templateUrl: './new-password-dialog.component.html',
  styleUrls: ['./new-password-dialog.component.scss']
})
export class NewPasswordDialogComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    old: [null, Validators.required],
    new: [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<NewPasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
  }

  change() {
    if (this.form.valid) {
      this.dialogRef.close({
        old: this.form.value.old,
        new: this.form.value.new
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
