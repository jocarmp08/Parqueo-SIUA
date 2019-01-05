import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from './dialog-data.interface';

@Component({
  selector: 'app-modify-counter-dialog',
  templateUrl: './modify-counter-dialog.component.html',
  styleUrls: ['./modify-counter-dialog.component.css']
})
export class ModifyCounterDialogComponent implements OnInit {

  // form: FormGroup;
  counter: number;
  maxCounter: number;
  form: FormGroup = this.formBuilder.group({
    counter: [this.counter,[Validators.min(0),Validators.max(this.data.maxCounter)]]
  });

  constructor(private formBuilder: FormBuilder,private dialogRef: MatDialogRef<ModifyCounterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
    this.counter = this.data.counter;
    this.maxCounter = this.data.maxCounter;

    // this.form = this.formBuilder.group({
    // counter: [this.counter,[Validators.min(0),Validators.max(this.maxCounter)]]
    // });
  }

  change(){
    if (this.form.valid){
      this.dialogRef.close(this.form.value.counter);
    }
  }

  cancel() {
    this.dialogRef.close();
  }





}
