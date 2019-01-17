import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {ContactService} from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm = this.formBuilder.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    subject: [null, Validators.required],
    type: [null, Validators.required],
    description: [null, Validators.compose([Validators.required, Validators.maxLength(1000)])]
  });

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<ContactComponent>, private contactService: ContactService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  private sendReport() {
    if (this.contactForm.valid) {
      // Prepare model
      const values = Object.assign({}, this.contactForm.value);
      const report = {
        email: values.email,
        subject: values.subject,
        type: parseInt(values.type, 10),
        description: values.description,
        creationDate: new Date(new Date().getTime()),
        isRead: false
      };

      this.contactService.postReport(report).subscribe((data) => {
        this.showSnackBarMessage('El reporte ha sido enviado', 'Aceptar');
      }, (error) => {
        this.showSnackBarMessage('Ocurrió un error al enviar el reporte, intente de nuevo', 'Aceptar');
      });
    }
  }

  private showSnackBarMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
