import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { GetdataService } from './getdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  constructor(public getdataService: GetdataService) {}


  ngOnInit() {
    this.getdataService.getData();
    interval(10000).subscribe(val => this.getdataService.getData())
  }

}
