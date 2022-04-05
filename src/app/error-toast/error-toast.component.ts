import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.scss']
})
export class ErrorToastComponent implements OnInit {

  @Input() error;
  
  constructor() { }

  ngOnInit() {
  }

}
