import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-grid',
  templateUrl: './post-grid.component.html',
  styleUrls: ['./post-grid.component.scss']
})
export class PostGridComponent implements OnInit {


  @Input() postDetailArray;

  constructor() { }

  ngOnInit() {
  }

}
