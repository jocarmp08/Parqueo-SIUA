import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ContactService} from '../../services/contact.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

    contactForm = this.formBuilder.group({
        email: [null, Validators.compose([Validators.required, Validators.email])],
        subject: [null, Validators.required],
        type: [null, Validators.required],
        description: [null, Validators.compose([Validators.required, Validators.maxLength(1000)])]
    });

    constructor(private formBuilder: FormBuilder, private contactService: ContactService, private toastCtrl: ToastController) {
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
                creationDate: new Date(new Date().getTime())
            };

            this.contactService.postReport(report).subscribe((data) => {
                this.presentToast('El reporte ha sido enviado')
            }, (error) => {
                this.presentToast('Ocurrió un error al enviar el reporte. Intente de nuevo.')
            });
        }
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }
}
