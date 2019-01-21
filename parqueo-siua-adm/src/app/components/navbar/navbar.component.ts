import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../shared/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
  }

  loggedIn() {
    return this.sharedService.loggedIn();
  }

  isSU() {
    return this.sharedService.isSU();
  }
}
