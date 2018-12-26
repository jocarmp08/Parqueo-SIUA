import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  maxDescriptionLength = 280;
  createNewsForm = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, [Validators.required, Validators.maxLength(280)]]
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

}
