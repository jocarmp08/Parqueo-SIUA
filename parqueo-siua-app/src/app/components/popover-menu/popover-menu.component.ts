import {Component, OnInit} from '@angular/core';
import {NavController, PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-popover-menu',
    templateUrl: './popover-menu.component.html',
    styleUrls: ['./popover-menu.component.scss']
})
export class PopoverMenuComponent implements OnInit {


    constructor(private navController: NavController, private popoverController: PopoverController) {
    }

    ngOnInit() {
    }

    private openContactPage() {
        this.navController.navigateForward('contact').then(() => {
            this.popoverController.dismiss();
        });
    }

    private openAboutPage() {
        this.navController.navigateForward('about').then(() => {
            this.popoverController.dismiss();
        });
    }

}
