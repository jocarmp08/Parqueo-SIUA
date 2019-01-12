import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';

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

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
    }

    private sendReport() {
        console.log('sent');
    }
}
