import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, tap } from 'rxjs';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private source$ = new Subject();

  constructor(public getdataService: GetdataService) { }

  ngOnInit(): void {
    this.source$.pipe(
      tap(data => console.log("haha: " + data)),
      debounceTime(300),
      distinctUntilChanged(),
      filter((data:any) => data.length >=5),
    ).subscribe((data:any) => this.getdataService.getClient(data));
  }

  search(login: string){
    this.source$.next(login);
    this.source$.subscribe(x => console.log("X is: " + x));
  }

}
